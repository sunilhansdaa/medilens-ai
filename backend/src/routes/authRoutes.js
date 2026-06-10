const express = require('express');
const { getProfile, login, register, updateSettings } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/profile', protect, getProfile);
router.put('/settings', protect, updateSettings);

module.exports = router;