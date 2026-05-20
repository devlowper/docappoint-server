const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User.model');

// Helper to generate JWT Token
const generateToken = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      name: user.name,
      email: user.email,
      photoURL: user.photoURL,
      provider: user.provider
    },
    process.env.JWT_SECRET,
    { expiresIn: '7d' } // Valid for 7 days
  );
};

// @desc    Register a new user
// @route   POST /api/auth/register
const register = async (req, res) => {
  try {
    const { name, email, password, photoURL } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email address already in use' });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      photoURL: photoURL || '',
      provider: 'email'
    });

    await newUser.save();

    const token = generateToken(newUser);

    res.status(201).json({
      success: true,
      token,
      data: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        photoURL: newUser.photoURL,
        provider: newUser.provider
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid email or password' });
    }

    // Validate provider
    if (user.provider !== 'email') {
      return res.status(400).json({ 
        success: false, 
        message: `This account was registered using Google. Please log in using Google instead.` 
      });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Invalid email or password' });
    }

    const token = generateToken(user);

    res.status(200).json({
      success: true,
      token,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        photoURL: user.photoURL,
        provider: user.provider
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Google Authentication (Create / Login user)
// @route   POST /api/auth/google
const googleLogin = async (req, res) => {
  try {
    const { name, email, photoURL } = req.body;

    if (!email || !name) {
      return res.status(400).json({ success: false, message: 'Invalid Google authentication payload' });
    }

    // Find or create user
    let user = await User.findOne({ email });

    if (!user) {
      // Create user if not exists
      user = new User({
        name,
        email,
        photoURL: photoURL || '',
        provider: 'google'
      });
      await user.save();
    } else {
      // If user exists, verify they aren't registered using local email password (or allow link)
      // For a better UX, if they are 'email' provider, let's update their provider to 'google' or just sign them in.
      // We can also update their name / photoURL with Google data
      user.name = name;
      if (photoURL) user.photoURL = photoURL;
      user.provider = 'google';
      await user.save();
    }

    const token = generateToken(user);

    res.status(200).json({
      success: true,
      token,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        photoURL: user.photoURL,
        provider: user.provider
      }
    });
  } catch (error) {
    console.error('Google Auth error:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

module.exports = {
  register,
  login,
  googleLogin
};
