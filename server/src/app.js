const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const authRoutes = require('./routes/authRoutes');
const binRoutes = require('./routes/binRoutes');
const scanRoutes = require('./routes/scanRoutes');
const complaintRoutes = require('./routes/complaintRoutes');
const collectionRoutes = require('./routes/collectionRoutes');
const rewardRoutes = require('./routes/rewardRoutes');
const iotRoutes = require('./routes/iotRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const centerRoutes = require('./routes/centerRoutes');

const app = express();
app.use(cors());
app.use(helmet({ contentSecurityPolicy: false }));
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok', timestamp: new Date() }));

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/bins', binRoutes);
app.use('/api/scans', scanRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/collections', collectionRoutes);
app.use('/api/rewards', rewardRoutes);
app.use('/api/iot', iotRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/centers', centerRoutes);

const path = require('path');
const fs = require('fs');

// Serve static frontend build if available
const clientDistPath = path.join(__dirname, '../../client/dist');
if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));
}

// 404 for unhandled API endpoints
app.use('/api', (req, res) => res.status(404).json({ message: 'API endpoint not found' }));

// SPA fallback for all web routes (e.g. /dashboard, /ai-detect, etc.)
app.get('*', (req, res, next) => {
  const indexPath = path.join(clientDistPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    return res.sendFile(indexPath);
  }
  res.status(404).json({ message: 'Resource not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ message: err.message || 'Server Error' });
});

module.exports = app;
