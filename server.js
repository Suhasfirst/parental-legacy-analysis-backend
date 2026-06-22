const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
const uploadRoutes = require('./routes/upload');
const analyzeRoutes = require('./routes/analyze');
const visualizeRoutes = require('./routes/visualize');
const reportRoutes = require('./routes/report');

app.use('/api/upload', uploadRoutes);
app.use('/api/analyze', analyzeRoutes);
app.use('/api/visualize', visualizeRoutes);
app.use('/api/report', reportRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'API is running', timestamp: new Date().toISOString() });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    path: req.path
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  const status = err.status || err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  
  res.status(status).json({
    success: false,
    error: message,
    status: status
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`📊 API endpoints:`);
  console.log(`   POST   /api/upload - Upload Excel file`);
  console.log(`   POST   /api/analyze - Analyze data`);
  console.log(`   GET    /api/visualize/bar - Generate bar chart`);
  console.log(`   GET    /api/visualize/pie - Generate pie chart`);
  console.log(`   GET    /api/visualize/heatmap - Generate heatmap`);
  console.log(`   GET    /api/report - Generate PDF report`);
});

module.exports = app;
