const express = require('express');
const router = express.Router();
const { signup, login, changePassword, updateProfile, resetData, deleteAccount } = require('../controllers/authController');
const authenticateToken = require('../middleware/auth');

// Routes publiques
router.post('/signup', signup);
router.post('/login', login);

// Routes protégées (token requis)
router.put('/change-password', authenticateToken, changePassword);
router.put('/profile', authenticateToken, updateProfile);
router.delete('/reset-data', authenticateToken, resetData);
router.delete('/delete-account', authenticateToken, deleteAccount);

module.exports = router;