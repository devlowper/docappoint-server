const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  specialty: {
    type: String,
    required: true
  },
  image: {
    type: String
  },
  experience: {
    type: String
  },
  availability: [{
    type: String
  }],
  description: {
    type: String
  },
  hospital: {
    type: String
  },
  location: {
    type: String
  },
  fee: {
    type: Number
  },
  rating: {
    type: Number,
    default: 0
  },
  qualification: {
    type: String
  },
  badge: {
    type: String
  },
  reviews: {
    type: Number
  },
  visits: {
    type: Number
  },
  originalFee: {
    type: Number
  },
  isOnline: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

const Doctor = mongoose.model('Doctor', doctorSchema);

module.exports = Doctor;
