const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware - CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    
    // Allow localhost for development
    if (origin.startsWith('http://localhost')) {
      return callback(null, true);
    }
    
    // Allow Vercel deployments (any .vercel.app domain)
    if (origin.includes('.vercel.app') || origin.includes('vercel.app')) {
      return callback(null, true);
    }
    
    // Allow custom domains (you can add your specific Vercel domain here)
    // Example: if (origin === 'https://your-app.vercel.app') return callback(null, true);
    
    callback(null, true); // Allow all origins for now - you can restrict this later
  },
  credentials: false,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Routes
const tasksRouter = require('./src/routes/tasks');
app.use('/api/tasks', tasksRouter);

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'test') {
  // Connect to MongoDB and start server only in non-test environments
  const MONGODB_URI = process.env.MONGODB_URI;

  if (!MONGODB_URI) {
    console.error('MONGODB_URI is not defined in environment variables');
    process.exit(1);
  }

  mongoose
    .connect(MONGODB_URI)
    .then(() => {
      console.log('Connected to MongoDB');
      app.listen(PORT, () => {
        console.log(`Server listening on port ${PORT}`);
      });
    })
    .catch((err) => {
      console.error('Error connecting to MongoDB', err);
      process.exit(1);
    });
}

module.exports = app;


