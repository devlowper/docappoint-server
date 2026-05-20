const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String
  },
  photoURL: {
    type: String,
    default: ''
  },
  provider: {
    type: String,
    default: 'email'
  },
  activePlan: {
    planName: { type: String, default: '' },
    billingCycle: { type: String, default: '' },
    price: { type: Number, default: 0 },
    startDate: { type: Date }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
