require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectDatabase } = require('./src/config/database');
const authRoutes = require('./src/routes/authRoutes');
const aiRoutes = require('./src/routes/aiRoutes');

/**
 * SmartEvalAI Backend Server
 * Professional Education Assessment Platform
 */

const app = express();

/**
 * Middleware Setup
 */

// CORS Configuration
const corsOptions = {
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));

// Body Parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Serve static files
app.use(express.static('public'));

/**
 * Request Logging Middleware (Development)
 */
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
  });
}

/**
 * Routes
 */

// Root Route
app.get('/', (req, res) => {
  res.send('SmartEvalAI Server Running 🚀');
});

// Health Check Route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Authentication Routes
app.use('/api/auth', authRoutes);

// AI Evaluation Routes
app.use('/api/ai', aiRoutes);

/**
 * 404 Handler
 */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.originalUrl
  });
});

/**
 * Global Error Handler
 */
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

/**
 * Start Server
 */
const DEFAULT_PORT = parseInt(process.env.PORT || '5000', 10);
const NODE_ENV = process.env.NODE_ENV || 'development';

/**
 * Try listening on a port; if occupied, increment and retry.
 */
const tryListen = (port) => {
  const server = app.listen(port, () => {
    console.log('\n');
    console.log('╔════════════════════════════════════════╗');
    console.log('║    SmartEvalAI Backend Server Started  ║');
    console.log('╚════════════════════════════════════════╝');
    console.log(`\n✓ Environment: ${NODE_ENV}`);
    console.log(`✓ Server: http://localhost:${port}`);
    console.log(`✓ API Docs: http://localhost:${port}/api/health`);
    console.log(`\n✓ Available Routes:`);
    console.log(`  - POST /api/auth/student/register`);
    console.log(`  - POST /api/auth/student/login`);
    console.log(`  - POST /api/auth/admin/register`);
    console.log(`  - POST /api/auth/admin/login`);
    console.log(`  - GET  /api/auth/me (protected)`);
    console.log(`  - POST /api/auth/logout (protected)`);      console.log(`  - POST /api/ai/evaluate`);
    console.log(`  - GET  /api/ai/results`);
  });

  server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
      console.warn(`\n⚠️  Port ${port} is in use; trying ${port + 1}...`);
      tryListen(port + 1);
    } else {
      console.error('✗ Server Error:', error);
      process.exit(1);
    }
  });
};

const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDatabase();

    // attempt to bind starting from DEFAULT_PORT
    tryListen(DEFAULT_PORT);
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Start the server
startServer();

/**
 * Handle Unhandled Promise Rejections
 */
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  process.exit(1);
});

module.exports = app;
