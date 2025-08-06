const express = require('express');
const router = express.Router();
const pool = require('../models/db'); // ✅ Correct import

// GET /api/stock-logs
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT sl.*, i.item_name
      FROM stock_logs sl
      JOIN inventory i ON sl.item_id = i.id
      ORDER BY sl.created_at DESC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error('GET /stock-logs error:', err);
    res.status(500).json({ error: 'Failed to fetch stock logs' });
  }
});

module.exports = router;
