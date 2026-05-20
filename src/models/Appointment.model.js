const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  userEmail: {
    type: String,
    required: true
  },
  doctorName: {
    type: String,
    required: true
  },
  doctorId: {
    type: String
  },
  doctorSpecialty: {
    type: String,
    default: 'Specialist'
  },
  fee: {
    type: Number,
    default: 0
  },
  patientName: {
    type: String,
    required: true
  },
  gender: {
    type: String
  },
  phone: {
    type: String
  },
  appointmentDate: {
    type: String,
    required: true
  },
  appointmentTime: {
    type: String,
    required: true
  },
  notes: {
    type: String
  },
  status: {
    type: String,
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Appointment = mongoose.model('Appointment', appointmentSchema);

module.exports = Appointment;
