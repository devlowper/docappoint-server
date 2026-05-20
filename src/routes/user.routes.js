const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/verifyToken');
const { updateProfile } = require('../controllers/user.controller');

// @route   PATCH /api/users/profile
// @desc    Update user profile (name, photoURL)
router.patch('/profile', verifyToken, updateProfile);

module.exports = router;
