const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware - CORS configuration
const allowedOrigins = [
  'http://localhost:3000',                    // Local development
  'http://localhost:3001',                    // Alternative local port
  'https://mern-app-chi-two.vercel.app',      // Production frontend on Vercel
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    
    // Check if origin is in allowed list
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    
    // Allow localhost for development (any port)
    if (origin.startsWith('http://localhost')) {
      return callback(null, true);
    }
    
    // Allow Vercel deployments (any .vercel.app domain)
    if (origin.includes('.vercel.app') || origin.includes('vercel.app')) {
      return callback(null, true);
    }
    
    // Reject other origins
    callback(new Error('Not allowed by CORS'));
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


