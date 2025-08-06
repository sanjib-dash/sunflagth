const express = require('express');
const router = express.Router();
const {
  getAllInventory,
  addInventory,
  updateInventory,
  deleteInventory
} = require('../controllers/inventoryController');

router.get('/', getAllInventory);
router.post('/', addInventory);
router.put('/:id', updateInventory);
router.delete('/:id', deleteInventory);
router.get('/names', async (req, res) => {
  try {
    const result = await pool.query('SELECT item_name, quantity FROM inventory ORDER BY item_name');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching item names', error: err.message });
  }
});

module.exports = router;
