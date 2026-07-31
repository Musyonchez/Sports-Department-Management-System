const express = require('express');
const { db } = require('../db');
const { requireAuth, requireRole } = require('../middleware/auth');

const router = express.Router();

const QUERIES = {
  bookings: `
    SELECT b.id, b.date, b.start_time, b.end_time, b.status, b.purpose,
           f.name AS facility_name, u.name AS user_name
    FROM bookings b
    JOIN facilities f ON f.id = b.facility_id
    JOIN users u ON u.id = b.user_id
    WHERE b.date BETWEEN ? AND ?
    ORDER BY b.date DESC
  `,
  equipment: `
    SELECT el.id, el.quantity, el.status, el.requested_at, el.returned_at,
           e.name AS equipment_name, u.name AS user_name
    FROM equipment_loans el
    JOIN equipment e ON e.id = el.equipment_id
    JOIN users u ON u.id = el.user_id
    WHERE date(el.requested_at) BETWEEN ? AND ?
    ORDER BY el.requested_at DESC
  `,
  users: `
    SELECT id, name, email, role, created_at
    FROM users
    WHERE date(created_at) BETWEEN ? AND ?
    ORDER BY created_at DESC
  `,
};

function runReport(type, from, to) {
  const query = QUERIES[type];
  if (!query) return null;
  return db.prepare(query).all(from || '0000-01-01', to || '9999-12-31');
}

function toCsv(rows) {
  if (rows.length === 0) return '';
  const headers = Object.keys(rows[0]);
  const escape = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
  const lines = [headers.join(',')];
  for (const row of rows) lines.push(headers.map(h => escape(row[h])).join(','));
  return lines.join('\n');
}

router.post('/generate', requireAuth, requireRole('officer', 'admin'), (req, res) => {
  const { type, from, to } = req.body;
  const rows = runReport(type, from, to);
  if (!rows) return res.status(400).json({ success: false, message: 'type must be bookings, equipment, or users' });
  res.json({ success: true, data: rows });
});

router.get('/export', requireAuth, requireRole('officer', 'admin'), (req, res) => {
  const { type, format = 'csv', from, to } = req.query;
  const rows = runReport(type, from, to);
  if (!rows) return res.status(400).json({ success: false, message: 'type must be bookings, equipment, or users' });

  if (format === 'csv') {
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=${type}-report.csv`);
    return res.send(toCsv(rows));
  }

  res.status(501).json({ success: false, message: 'PDF export is not implemented yet — use format=csv' });
});

module.exports = router;
