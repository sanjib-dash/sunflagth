const express = require('express');
const router = express.Router();
const { getStockLogs } = require('../controllers/logController');

router.get('/', getStockLogs);

module.exports = router;
