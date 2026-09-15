const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/verifyToken');
const { createPaymentIntent, confirmPayment, createPlanPaymentIntent, confirmPlanPayment } = require('../controllers/payment.controller');

// Require authentication for all payment routes
router.use(verifyToken);

// @route   POST /api/payment/create-payment-intent
// @desc    Create a new stripe payment intent
router.post('/create-payment-intent', createPaymentIntent);

// @route   POST /api/payment/confirm
// @desc    Confirm payment and update appointment status
router.post('/confirm', confirmPayment);

// @route   POST /api/payment/create-plan-intent
// @desc    Create a new stripe payment intent for a health plan
router.post('/create-plan-intent', createPlanPaymentIntent);

// @route   POST /api/payment/confirm-plan
// @desc    Confirm payment and update user active plan
router.post('/confirm-plan', confirmPlanPayment);

module.exports = router;
