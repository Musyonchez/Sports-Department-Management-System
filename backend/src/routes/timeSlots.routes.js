const express = require('express');
const { db } = require('../db');
const { requireAuth, requireRole } = require('../middleware/auth');

const router = express.Router();

router.post('/', requireAuth, requireRole('officer', 'admin'), (req, res) => {
  const { facility_id, date, start_time, end_time } = req.body;
  if (!facility_id || !date || !start_time || !end_time) {
    return res.status(400).json({ success: false, message: 'facility_id, date, start_time, end_time are required' });
  }

  try {
    const result = db.prepare(`
      INSERT INTO time_slots (facility_id, date, start_time, end_time)
      VALUES (?, ?, ?, ?)
    `).run(facility_id, date, start_time, end_time);
    const slot = db.prepare('SELECT * FROM time_slots WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json({ success: true, data: slot });
  } catch (err) {
    if (err.code === 'ERR_SQLITE_ERROR' && /UNIQUE/.test(err.message)) {
      return res.status(409).json({ success: false, message: 'That time slot already exists' });
    }
    throw err;
  }
});

router.get('/', (req, res) => {
  const { facility } = req.query;
  if (!facility) {
    return res.status(400).json({ success: false, message: 'facility query param is required' });
  }

  const slots = db.prepare('SELECT * FROM time_slots WHERE facility_id = ? ORDER BY date, start_time').all(facility);
  const withAvailability = slots.map(slot => {
    const booked = db.prepare(`
      SELECT 1 FROM bookings
      WHERE time_slot_id = ? AND status != 'cancelled'
    `).get(slot.id);
    return { ...slot, is_booked: !!booked };
  });

  res.json({ success: true, data: withAvailability });
});

router.delete('/:id', requireAuth, requireRole('officer', 'admin'), (req, res) => {
  const activeBooking = db.prepare(`
    SELECT 1 FROM bookings WHERE time_slot_id = ? AND status != 'cancelled'
  `).get(req.params.id);
  if (activeBooking) {
    return res.status(409).json({ success: false, message: 'Cannot delete a slot with an active booking' });
  }

  const result = db.prepare('DELETE FROM time_slots WHERE id = ?').run(req.params.id);
  if (result.changes === 0) return res.status(404).json({ success: false, message: 'Time slot not found' });
  res.json({ success: true, data: null });
});

module.exports = router;
