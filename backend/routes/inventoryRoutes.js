const express = require('express');
const router = express.Router();
const { getInventory, addInventory } = require('../controllers/inventoryController');
const { verifyToken } = require('../middleware/authMiddleware');

router.get('/', verifyToken, getInventory);
router.post('/', verifyToken, addInventory);

module.exports = router;