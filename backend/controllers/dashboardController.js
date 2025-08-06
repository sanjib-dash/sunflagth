const pool = require('../models/db');

exports.getDashboardCounts = async (req, res) => {
  try {
    const [inventory, stockIn, stockOut, production] = await Promise.all([
      pool.query('SELECT COUNT(*) FROM inventory'),
      pool.query(`SELECT COALESCE(SUM(quantity), 0) FROM stock_logs WHERE change_type = 'added'`),
      pool.query(`SELECT COALESCE(SUM(quantity), 0) FROM stock_logs WHERE change_type = 'deducted'`),
      pool.query('SELECT COUNT(*) FROM production_orders')
    ]);

    res.json({
      inventoryItems: parseInt(inventory.rows[0].count),
      stockIn: parseInt(stockIn.rows[0].coalesce),
      stockOut: parseInt(stockOut.rows[0].coalesce),
      productionOrders: parseInt(production.rows[0].count)
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to load dashboard data', error: err.message });
  }
};
// Stock movement over time (past 7 days)
exports.getStockTrend = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        DATE(created_at) AS date,
        SUM(CASE WHEN change_type = 'added' THEN quantity ELSE 0 END) AS stock_in,
        SUM(CASE WHEN change_type = 'deducted' THEN quantity ELSE 0 END) AS stock_out
      FROM stock_logs
      WHERE created_at >= CURRENT_DATE - INTERVAL '7 days'
      GROUP BY date
      ORDER BY date
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch stock trend', error: err.message });
  }
};

// Production status count
exports.getProductionStatus = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT status, COUNT(*) FROM production_orders GROUP BY status
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch production status', error: err.message });
  }
};
exports.getInventoryCategorySummary = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT category, COUNT(*) as count
      FROM inventory
      GROUP BY category
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch inventory category summary', error: err.message });
  }
};
