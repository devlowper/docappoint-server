const express = require('express');
const router = express.Router();
const { getAllDoctors, getDoctorById } = require('../controllers/doctor.controller');
const verifyToken = require('../middlewares/verifyToken');

// @route   GET /api/doctors
// @desc    Fetch all doctors with optional search, sorting, and limit (public)
router.get('/', getAllDoctors);

// @route   GET /api/doctors/:id
// @desc    Fetch a single doctor by their MongoDB ID (protected)
router.get('/:id', verifyToken, getDoctorById);

module.exports = router;
