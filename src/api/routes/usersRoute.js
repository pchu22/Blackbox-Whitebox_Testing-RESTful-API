const express = require('express');
const router = express.Router();
const userController = require('../controllers/usersController');
const verifyToken = require('../middlewares/tokenVerification');

router.get('/', verifyToken, userController.getUsers);
router.post('/', userController.createUser);
router.put('/:id', verifyToken, userController.updateUser);

module.exports = router;