const express = require('express');
const router = express.Router();
const { register, login, googleLogin } = require('../controllers/auth.controller');

// @route   POST /api/auth/register
// @desc    Register a new user
router.post('/register', register);

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
router.post('/login', login);

// @route   POST /api/auth/google
// @desc    Handle Google Sign-In (Login / Auto-register)
router.post('/google', googleLogin);

module.exports = router;
