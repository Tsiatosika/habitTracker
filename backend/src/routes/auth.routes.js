const express = require('express');
const router = express.Router();
const { signup, login } = require('../controllers/authController');

// Route d'inscription
router.post('/signup', signup);

// Route de connexion
router.post('/login', login);

module.exports = router;