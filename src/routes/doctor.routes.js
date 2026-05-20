const express = require('express');
const router = express.Router();
const { getAllDoctors, getDoctorById } = require('../controllers/doctor.controller');

// @route   GET /api/doctors
// @desc    Fetch all doctors with optional search, sorting, and limit
router.get('/', getAllDoctors);

// @route   GET /api/doctors/:id
// @desc    Fetch a single doctor by their MongoDB ID
router.get('/:id', getDoctorById);

module.exports = router;
