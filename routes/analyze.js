const express = require('express');
const router = express.Router();
const { readExcelFile, cleanAndValidateData } = require('../utils/excelParser');
const { analyzeData } = require('../utils/analyzer');
const uploadRoutes = require('./upload');

let cachedAnalysis = null;

/**
 * POST /api/analyze
 * Analyze data from uploaded Excel file
 */
router.post('/', (req, res) => {
  try {
    const uploadedFilePath = uploadRoutes.getUploadedFilePath();

    if (!uploadedFilePath) {
      return res.status(400).json({
        success: false,
        error: 'No file uploaded. Please upload a file first.'
      });
    }

    // Read Excel file
    const excelResult = readExcelFile(uploadedFilePath);
    if (!excelResult.success) {
      return res.status(400).json({
        success: false,
        error: 'Failed to read Excel file: ' + excelResult.error
      });
    }

    // Clean and validate data
    const cleanResult = cleanAndValidateData(excelResult.data);
    if (!cleanResult.success) {
      return res.status(400).json({
        success: false,
        error: 'Failed to clean data: ' + cleanResult.error
      });
    }

    // Analyze data
    const analysis = analyzeData(cleanResult.data);
    if (!analysis.success) {
      return res.status(400).json({
        success: false,
        error: 'Analysis failed: ' + analysis.error
      });
    }

    // Cache the analysis for use in other endpoints
    cachedAnalysis = analysis;

    res.json({
      success: true,
      data: analysis
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/analyze/report
 * Get analysis report
 */
router.get('/report', (req, res) => {
  try {
    if (!cachedAnalysis) {
      return res.status(400).json({
        success: false,
        error: 'No analysis available. Please run analysis first.'
      });
    }

    res.json({
      success: true,
      data: cachedAnalysis
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Export functions to access cached analysis
router.getCachedAnalysis = () => cachedAnalysis;
router.setCachedAnalysis = (data) => { cachedAnalysis = data; };

module.exports = router;
