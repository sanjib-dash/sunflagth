const pool = require('../models/db');

exports.stockIn = async (req, res) => {
  const { item_name, quantity } = req.body;

  try {
    await pool.query(
      'INSERT INTO stock (item_name, quantity, type) VALUES ($1, $2, $3)',
      [item_name, quantity, 'in']
    );
    res.status(201).json({ message: 'Stock In recorded successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error during Stock In', error: err.message });
  }
};

exports.stockOut = async (req, res) => {
  const { item_name, quantity } = req.body;

  try {
    await pool.query(
      'INSERT INTO stock (item_name, quantity, type) VALUES ($1, $2, $3)',
      [item_name, quantity, 'out']
    );
    res.status(201).json({ message: 'Stock Out recorded successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error during Stock Out', error: err.message });
  }
};

exports.getStock = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT item_name,
             SUM(CASE WHEN type = 'in' THEN quantity ELSE -quantity END) AS total_quantity
      FROM stock
      GROUP BY item_name
    `);

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch stock', error: err.message });
  }
};
