require('dotenv').config();
require('dns').setDefaultResultOrder('ipv4first');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const requiredEnv = ['MONGO_URI', 'JWT_SECRET'];
const missingEnv = requiredEnv.filter((key) => !process.env[key]);
if (missingEnv.length > 0) {
  console.error(`Missing required environment variables: ${missingEnv.join(', ')}`);
  console.error('Copy server/.env.example to server/.env and fill in your values.');
  process.exit(1);
}

if (process.env.JWT_SECRET === 'your_rotated_jwt_secret_here' || process.env.JWT_SECRET === 'your_super_secret_jwt_key_here') {
  console.warn('Warning: JWT_SECRET is still using the example placeholder. Change it in server/.env before production.');
}

const app = express();

// Comma-separated origins, e.g. https://docapoint.netlify.app,http://localhost:5173
const allowedOrigins = (process.env.CLIENT_ORIGIN || process.env.CLIENT_URL || 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS blocked for origin: ${origin}`));
    }
  },
  credentials: true
}));
app.use(express.json());

// Database connection
mongoose.connect(process.env.MONGO_URI, { family: 4 })
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.use('/api', require('./src/routes'));

app.get('/', (req, res) => {
  res.json({ status: 'DocAppoint server running' });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
