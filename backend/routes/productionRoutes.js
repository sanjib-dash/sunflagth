const express = require('express');
const router = express.Router();
const pool = require('../models/db');

// GET all production records
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT p.*, i.item_name 
      FROM productions p 
      JOIN inventory i ON p.item_id = i.id 
      ORDER BY p.created_at DESC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error('GET /production error:', err);
    res.status(500).json({ error: 'Failed to fetch productions' });
  }
});

// POST a new production and deduct stock
// POST a new production and deduct stock
router.post('/', async (req, res) => {
  const { item_id, product_name, quantity, status = 'Pending' } = req.body;

  try {
    const client = await pool.connect();
    await client.query('BEGIN');

    // 1. Check stock
    const inv = await client.query('SELECT quantity FROM inventory WHERE id = $1', [item_id]);
    if (inv.rows.length === 0) throw new Error('Item not found');
    if (inv.rows[0].quantity < quantity) throw new Error('Insufficient inventory');

    // 2. Deduct inventory
    await client.query('UPDATE inventory SET quantity = quantity - $1 WHERE id = $2', [quantity, item_id]);

    // 3. Insert production with status
    const prod = await client.query(
      'INSERT INTO productions (item_id, product_name, quantity, status) VALUES ($1, $2, $3, $4) RETURNING id',
      [item_id, product_name, quantity, status]
    );
    const productionId = prod.rows[0].id;

    // 4. Log stock deduction
    await client.query(
      `INSERT INTO stock_logs (item_id, action, quantity, source, reference_id)
       VALUES ($1, $2, $3, $4, $5)`,
      [item_id, 'Stock Out', quantity, 'Production', productionId]
    );

    await client.query('COMMIT');
    client.release();

    res.json({ message: 'Production saved and logged' });
  } catch (err) {
    console.error('POST /production error:', err);
    res.status(400).json({ error: err.message });
  }
});


module.exports = router;
