const express = require('express');
const router = express.Router();
const orderController = require('../controllers/ordersController');
const verifyToken = require('../middlewares/tokenVerification');
const verifyOwner = require('../middlewares/ownerVerification');
const verifyRole = require('../middlewares/roleVerification');

router.get('/:id', verifyToken, verifyOwner, orderController.getOrderById);
router.post('/', verifyToken, verifyRole, orderController.createOrder);

module.exports = router;