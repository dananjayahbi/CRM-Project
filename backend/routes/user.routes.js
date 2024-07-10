const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { protect } = require('../middleware/authorization');

router.get('/createDefaultAdmin', userController.createDefaultAdmin);
router.post('/createUser', userController.createUser);
router.post('/loginUser', userController.loginUser);
router.get('/token/:id', userController.getNewToken);
router.get('/getAllUsers', protect, userController.getAllUsers);
router.get('/getUserById/:id', userController.getUserById);
router.put('/updateUser/:id', userController.updateUser);
router.delete('/deleteUser/:id', userController.deleteUser);

module.exports = router;
