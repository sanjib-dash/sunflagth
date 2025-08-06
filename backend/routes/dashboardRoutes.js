const express = require('express');
const router = express.Router();
const pool = require('../models/db');

router.get('/', async (req, res) => {
  try {
    const { startDate, endDate, category } = req.query;

    let inventoryQuery = `SELECT COUNT(*) FROM inventory`;
    let stockInQuery = `SELECT COALESCE(SUM(quantity), 0) FROM stock_logs WHERE type = 'in'`;
    let stockOutQuery = `SELECT COALESCE(SUM(quantity), 0) FROM stock_logs WHERE type = 'out'`;
    let productionQuery = `SELECT status, COUNT(*) FROM productions`;

    const conditions = [];
    const values = [];

    if (startDate && endDate) {
      conditions.push(`created_at BETWEEN $${values.length + 1} AND $${values.length + 2}`);
      values.push(startDate, endDate);
    }

    if (category) {
      inventoryQuery += ` WHERE category = $${values.length + 1}`;
      values.push(category);
    }

    if (conditions.length) {
      stockInQuery += ` AND ${conditions.join(' AND ')}`;
      stockOutQuery += ` AND ${conditions.join(' AND ')}`;
      productionQuery += ` WHERE ${conditions.join(' AND ')}`;
    }

    inventoryQuery += ';';
    stockInQuery += ';';
    stockOutQuery += ';';
    productionQuery += ` GROUP BY status;`;

    const [inventoryRes, stockInRes, stockOutRes, productionRes] = await Promise.all([
      pool.query(inventoryQuery, values),
      pool.query(stockInQuery, values),
      pool.query(stockOutQuery, values),
      pool.query(productionQuery, values),
    ]);

    res.json({
      inventoryCount: inventoryRes.rows[0].count,
      stockIn: stockInRes.rows[0].coalesce,
      stockOut: stockOutRes.rows[0].coalesce,
      productionStatus: productionRes.rows,
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
