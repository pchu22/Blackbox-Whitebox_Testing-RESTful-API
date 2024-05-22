const express = require('express');
const router = express.Router();
const userController = require('../controllers/usersController');
const verifyToken = require('../middlewares/tokenVerification');
const verifyRole = require('../middlewares/roleVerification');
const verifyId = require('../middlewares/idVerification');

router.get('/', verifyToken, verifyRole, userController.getUsers);
router.post('/', verifyToken, verifyRole, userController.createUser);
router.put('/:id', verifyToken, verifyId, userController.updateUser);

module.exports = router;