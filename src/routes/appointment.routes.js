const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/verifyToken');
const {
  createAppointment,
  getAppointmentsByEmail,
  updateAppointment,
  deleteAppointment
} = require('../controllers/appointment.controller');

// Require authentication for all appointment routes
router.use(verifyToken);

// @route   POST /api/appointments
// @desc    Create a new appointment
router.post('/', createAppointment);

// @route   GET /api/appointments
// @desc    Get all appointments matching the provided email query parameter
router.get('/', getAppointmentsByEmail);

// @route   PATCH /api/appointments/:id
// @desc    Update specific fields of an appointment
router.patch('/:id', updateAppointment);

// @route   DELETE /api/appointments/:id
// @desc    Delete an appointment by ID
router.delete('/:id', deleteAppointment);

module.exports = router;
