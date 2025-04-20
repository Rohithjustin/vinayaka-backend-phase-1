require("dotenv").config();
const express = require("express");
const cors = require("cors");

const connectDB = require('./config/mongodb');
const authRoutes = require('./routes/auth');

const app = express();
connectDB();  // Connect to MongoDB

// Middleware
app.use(express.json());  // Parse incoming JSON requests
app.use(cors());  // Enable CORS for cross-origin requests

// Routes
app.use('/auth', authRoutes);

// Protected Route Example
app.get('/', (req, res) => {
  res.json({ msg: 'Welcome to the Big Market APIs' });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
