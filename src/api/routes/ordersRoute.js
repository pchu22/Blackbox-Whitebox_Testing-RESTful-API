const express = require('express');
const router = express.Router();
const orderController = require('../controllers/ordersController');
const verifyToken = require('../middlewares/tokenVerification');

// add middleware to see if user has access to route

router.get('/:id', verifyToken, orderController.getOrderById);
router.post('/', verifyToken, orderController.createOrder);

module.exports = router;