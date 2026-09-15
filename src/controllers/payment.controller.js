const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Appointment = require('../models/Appointment.model');

const createPaymentIntent = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    const appointment = await Appointment.findById(appointmentId);
    
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    // Amount should be in smallest currency unit, e.g. BDT to poisha (multiply by 100)
    // Here we assume fee is in BDT
    const amount = appointment.fee * 100;

    if (amount <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid appointment fee' });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: 'bdt',
      metadata: {
        appointmentId: appointmentId.toString(),
        patientName: appointment.patientName
      }
    });

    res.status(200).json({
      success: true,
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(500).json({ success: false, message: 'Failed to create payment intent' });
  }
};

const confirmPayment = async (req, res) => {
  try {
    const { appointmentId, transactionId } = req.body;
    
    const appointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      {
        paymentStatus: 'paid',
        transactionId: transactionId
      },
      { new: true }
    );

    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    res.status(200).json({ success: true, data: appointment });
  } catch (error) {
    console.error('Error confirming payment:', error);
    res.status(500).json({ success: false, message: 'Failed to confirm payment' });
  }
};

const User = require('../models/User.model');

const createPlanPaymentIntent = async (req, res) => {
  try {
    const { price, planName } = req.body;
    
    // Amount in poisha
    const amount = price * 100;

    if (amount <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid plan price' });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: 'bdt',
      metadata: {
        planName: planName,
        userEmail: req.user?.email || 'unknown'
      }
    });

    res.status(200).json({
      success: true,
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error('Error creating plan payment intent:', error);
    res.status(500).json({ success: false, message: 'Failed to create plan payment intent' });
  }
};

const confirmPlanPayment = async (req, res) => {
  try {
    const { planName, billingCycle, price, transactionId } = req.body;
    
    // Check if user exists
    const userEmail = req.user?.email;
    if (!userEmail) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const activePlanData = {
      planName,
      billingCycle,
      price,
      startDate: new Date()
    };

    const user = await User.findOneAndUpdate(
      { email: userEmail },
      { activePlan: activePlanData },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({ success: true, data: activePlanData });
  } catch (error) {
    console.error('Error confirming plan payment:', error);
    res.status(500).json({ success: false, message: 'Failed to confirm plan payment' });
  }
};

module.exports = {
  createPaymentIntent,
  confirmPayment,
  createPlanPaymentIntent,
  confirmPlanPayment
};
