const pool = require('../models/db');

exports.getAllProductionOrders = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM production_orders ORDER BY id DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching production orders', error: err.message });
  }
};

exports.addProductionOrder = async (req, res) => {
  const { product_name, quantity, production_date } = req.body;
  try {
    await pool.query(
      'INSERT INTO production_orders (product_name, quantity, production_date) VALUES ($1, $2, $3)',
      [product_name, quantity, production_date]
    );
    res.status(201).json({ message: 'Production order added' });
  } catch (err) {
    res.status(500).json({ message: 'Error adding production order', error: err.message });
  }
};

exports.updateProductionStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    // Update status
    await pool.query('UPDATE production_orders SET status = $1 WHERE id = $2', [status, id]);

    // If status is Completed → Deduct inventory
    if (status === 'Completed') {
      const result = await pool.query('SELECT product_name, quantity FROM production_orders WHERE id = $1', [id]);
      const order = result.rows[0];

      await pool.query(
        'UPDATE inventory SET quantity = quantity - $1 WHERE item_name = $2',
        [order.quantity, order.product_name]
      );
    }

    res.json({ message: 'Status updated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error updating status', error: err.message });
  }
};

