// backend/server.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./models');
const mainRouter = require('./routes');
const { notFoundHandler, errorHandler } = require('./middleware/errorMiddleware');

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Root endpoint - Welcome message
app.get('/', (req, res) => {
  res.status(200).json({
    project: 'BlueMoon Apartment Management System',
    version: '2.1',
    status: 'running',
    endpoints: {
      health: '/health',
      api: '/api'
    }
  });
});

// Suppress favicon 404s
app.get('/favicon.ico', (req, res) => res.status(204).end());

// Main API Router
app.use('/api', mainRouter);

// Error Handling (Must be AFTER routes)
app.use(notFoundHandler); // 404 for unmatched routes
app.use(errorHandler);    // Global error handler

const startServer = async () => {
  try {
    await db.sequelize.authenticate();
    console.log('>>>> Kết nối CSDL thành công!');

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`>>>> Server đang chạy tại:`);
      console.log(`     - Local:   http://localhost:${PORT}`);
      console.log(`     - API:     http://localhost:${PORT}/api`);
      console.log(`     - Health:  http://localhost:${PORT}/health`);
    });
  } catch (error) {
    console.error('!!! LỖI: Không thể kết nối đến CSDL:', error.message);
    process.exit(1);
  }
};

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION! Shutting down...');
  console.error(err.name, err.message);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION! Shutting down...');
  console.error(err.name, err.message);
  process.exit(1);
});

startServer();