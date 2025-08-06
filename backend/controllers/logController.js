const pool = require('../models/db');

exports.getStockLogs = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM stock_logs ORDER BY created_at DESC'
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch logs', error: err.message });
  }
};
