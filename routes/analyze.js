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

    // Verify file exists
    const fs = require('fs');
    if (!fs.existsSync(uploadedFilePath)) {
      return res.status(400).json({
        success: false,
        error: `File not found at path: ${uploadedFilePath}`
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

    if (!excelResult.data || excelResult.data.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Excel file is empty or has no data rows'
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

    // Check if analysis returned all zeros (possible data format issue)
    const allZeros = analysis.validation && analysis.validation.motherTotal === 0 && analysis.validation.fatherTotal === 0;
    
    res.json({
      success: true,
      data: analysis,
      ...(allZeros && {
        warning: 'Analysis returned all zeros. Check file format. Use GET /api/analyze/debug to diagnose.',
        columns: excelResult.columns,
        firstRow: cleanResult.data[0]
      })
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/analyze/debug
 * Debug endpoint to see what data analyzer receives
 */
router.get('/debug', (req, res) => {
  try {
    const uploadedFilePath = uploadRoutes.getUploadedFilePath();

    if (!uploadedFilePath) {
      return res.status(400).json({
        success: false,
        error: 'No file uploaded'
      });
    }

    const fs = require('fs');
    if (!fs.existsSync(uploadedFilePath)) {
      return res.status(400).json({
        success: false,
        error: `File not found at: ${uploadedFilePath}`
      });
    }

    // Read Excel file
    const excelResult = readExcelFile(uploadedFilePath);
    
    res.json({
      success: true,
      debug: {
        filePath: uploadedFilePath,
        fileExists: true,
        excelRead: excelResult,
        rawData: excelResult.data ? excelResult.data.slice(0, 3) : null
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
