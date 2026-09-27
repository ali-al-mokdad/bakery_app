const express = require('express');
const router = express.Router();
const { login, logout, getMe, changePassword } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/login', login);
router.post('/logout', logout);
router.get('/me', authMiddleware, getMe);
router.post('/change-password', authMiddleware, changePassword);

module.exports = router;
