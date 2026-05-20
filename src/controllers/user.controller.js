const User = require('../models/User.model');

const updateProfile = async (req, res) => {
  try {
    const { name, photoURL, activePlan } = req.body;
    
    // Assumes the decoded JWT payload contains the user's email
    const email = req.user?.email;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Invalid token: email missing' });
    }

    const updates = {};
    if (name !== undefined) updates.name = name;
    if (photoURL !== undefined) updates.photoURL = photoURL;
    if (activePlan !== undefined) updates.activePlan = activePlan;

    const updatedUser = await User.findOneAndUpdate(
      { email },
      { $set: updates },
      { new: true, runValidators: true }
    ).select('-password'); // Exclude the password field from the result

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({ success: true, data: updatedUser });
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

module.exports = {
  updateProfile
};
