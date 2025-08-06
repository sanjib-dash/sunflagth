const pool = require('../models/db');

exports.getAllInventory = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM inventory ORDER BY id DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch inventory', error: err.message });
  }
};

exports.addInventory = async (req, res) => {
  const { item_name, category, unit, quantity } = req.body;
  try {
    await pool.query(
      'INSERT INTO inventory (item_name, category, unit, quantity) VALUES ($1, $2, $3, $4)',
      [item_name, category, unit, quantity]
    );
    res.status(201).json({ message: 'Item added successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to add item', error: err.message });
  }
};

exports.updateInventory = async (req, res) => {
  const id = req.params.id;
  const { item_name, category, unit, quantity } = req.body;
  try {
    await pool.query(
      'UPDATE inventory SET item_name=$1, category=$2, unit=$3, quantity=$4 WHERE id=$5',
      [item_name, category, unit, quantity, id]
    );
    res.json({ message: 'Item updated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update item', error: err.message });
  }
};

exports.deleteInventory = async (req, res) => {
  const id = req.params.id;
  try {
    await pool.query('DELETE FROM inventory WHERE id=$1', [id]);
    res.json({ message: 'Item deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete item', error: err.message });
  }
};
