const router = require('express').Router();
const { protect } = require('../middleware/authorization');

const {
    createDefaultAdmin,
} = require('../controllers/user.controller');

// Create the default super-admin user
// router.post('/createDefaultAdmin', protect, createDefaultAdmin);
router.post('/createDefaultAdmin', createDefaultAdmin);

module.exports = router;