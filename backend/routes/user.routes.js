const router = require('express').Router();
const { protect } = require('../middleware/authorization');

const {
    createDefaultAdmin,
    createUser,
    loginUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
} = require('../controllers/user.controller');

// Create the default super-admin user
// router.post('/createDefaultAdmin', protect, createDefaultAdmin);
router.post('/createDefaultAdmin', createDefaultAdmin);

// Create a new user
// router.post('/createUser', protect, createUser);
router.post('/createUser', createUser);

// Login a user
router.post('/login', loginUser);

// Get all users
// router.get('/getAllUsers', protect, getAllUsers);
router.get('/getAllUsers', getAllUsers);

// Get a user by id
// router.get('/getUserById/:id', protect, getUserById);
router.get('/getUserById/:id', getUserById);

// Update a user by id
// router.put('/updateUser/:id', protect, updateUser);
router.put('/updateUser/:id', updateUser);

// Delete a user by id
// router.delete('/deleteUser/:id', protect, deleteUser);
router.delete('/deleteUser/:id', deleteUser);

module.exports = router;