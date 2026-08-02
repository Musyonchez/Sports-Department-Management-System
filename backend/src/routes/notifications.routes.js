const express = require('express');
const { db } = require('../db');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

router.get('/', requireAuth, (req, res) => {
  const notifications = db.prepare(`
    SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC
  `).all(req.user.sub);
  res.json({ success: true, data: notifications });
});

router.post('/:id/read', requireAuth, (req, res) => {
  const result = db.prepare(`
    UPDATE notifications SET is_read = 1 WHERE id = ? AND user_id = ?
  `).run(req.params.id, req.user.sub);
  if (result.changes === 0) return res.status(404).json({ success: false, message: 'Notification not found' });
  res.json({ success: true, data: null });
});

router.post('/read-all', requireAuth, (req, res) => {
  db.prepare('UPDATE notifications SET is_read = 1 WHERE user_id = ?').run(req.user.sub);
  res.json({ success: true, data: null });
});

module.exports = router;
