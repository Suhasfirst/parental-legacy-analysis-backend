const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { generatePDFReport } = require('../utils/reportGenerator');
const analyzeRoutes = require('./analyze');

/**
 * GET /api/report
 * Generate and return PDF report
 */
router.get('/', async (req, res) => {
  try {
    const analysis = analyzeRoutes.getCachedAnalysis();

    if (!analysis || !analysis.success) {
      return res.status(400).json({
        success: false,
        error: 'No analysis available. Please run analysis first.'
      });
    }

    // Generate PDF report (without embedded images)
    const reportResult = await generatePDFReport(analysis, null);

    if (!reportResult.success) {
      return res.status(400).json({
        success: false,
        error: 'Failed to generate PDF report: ' + reportResult.error
      });
    }

    // Send the PDF file
    res.download(reportResult.path, reportResult.filename, (err) => {
      if (err) {
        console.error('Error downloading report:', err);
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/report/list
 * List all generated reports
 */
router.get('/list', (req, res) => {
  try {
    const reportsDir = path.join(__dirname, '../reports');

    if (!fs.existsSync(reportsDir)) {
      return res.json({
        success: true,
        reports: []
      });
    }

    const files = fs.readdirSync(reportsDir);
    const reports = files.map(file => {
      const filePath = path.join(reportsDir, file);
      const stats = fs.statSync(filePath);
      return {
        filename: file,
        size: stats.size,
        createdAt: stats.birthtime,
        path: `/api/report/download/${file}`
      };
    });

    res.json({
      success: true,
      reports
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/report/download/:filename
 * Download a specific report
 */
router.get('/download/:filename', (req, res) => {
  try {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, '../reports', filename);

    // Security check - ensure the file is in reports directory
    const realPath = fs.realpathSync(filePath);
    const reportsDir = fs.realpathSync(path.join(__dirname, '../reports'));

    if (!realPath.startsWith(reportsDir)) {
      return res.status(403).json({
        success: false,
        error: 'Access denied'
      });
    }

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        error: 'Report not found'
      });
    }

    res.download(filePath, filename);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
