const Appointment = require('../models/Appointment.model');

const createAppointment = async (req, res) => {
  try {
    const newAppointment = new Appointment(req.body);
    const savedAppointment = await newAppointment.save();
    res.status(201).json({ success: true, data: savedAppointment });
  } catch (error) {
    console.error('Error creating appointment:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

const getAppointmentsByEmail = async (req, res) => {
  try {
    const { email } = req.query;
    
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email query parameter is required' });
    }

    // Case-insensitive exact match for email
    const appointments = await Appointment.find({
      userEmail: { $regex: new RegExp(`^${email}$`, 'i') }
    });

    res.status(200).json({ success: true, count: appointments.length, data: appointments });
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

const updateAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Extract only the allowed fields from the request body
    const { appointmentDate, appointmentTime, phone, gender, notes } = req.body;
    
    const updates = {};
    if (appointmentDate !== undefined) updates.appointmentDate = appointmentDate;
    if (appointmentTime !== undefined) updates.appointmentTime = appointmentTime;
    if (phone !== undefined) updates.phone = phone;
    if (gender !== undefined) updates.gender = gender;
    if (notes !== undefined) updates.notes = notes;

    const updatedAppointment = await Appointment.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!updatedAppointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    res.status(200).json({ success: true, data: updatedAppointment });
  } catch (error) {
    console.error('Error updating appointment:', error);
    if (error.name === 'CastError') {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

const deleteAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    
    const deletedAppointment = await Appointment.findByIdAndDelete(id);

    if (!deletedAppointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    res.status(200).json({ success: true, message: 'Deleted successfully' });
  } catch (error) {
    console.error('Error deleting appointment:', error);
    if (error.name === 'CastError') {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

module.exports = {
  createAppointment,
  getAppointmentsByEmail,
  updateAppointment,
  deleteAppointment
};
