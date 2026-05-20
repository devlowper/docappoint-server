const express = require('express');
const router = express.Router();

const doctorRoutes = require('./doctor.routes');
const appointmentRoutes = require('./appointment.routes');
const userRoutes = require('./user.routes');
const authRoutes = require('./auth.routes');

router.use('/doctors', doctorRoutes);
router.use('/appointments', appointmentRoutes);
router.use('/users', userRoutes);
router.use('/auth', authRoutes);

module.exports = router;
