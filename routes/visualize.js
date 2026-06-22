const express = require('express');
const router = express.Router();
const { generateBarChart, generatePieChart, generateHeatmap, getChartConfigs } = require('../utils/chartGenerator');
const analyzeRoutes = require('./analyze');

/**
 * GET /api/visualize/bar
 * Generate and return bar chart
 */
router.get('/bar', async (req, res) => {
  try {
    const analysis = analyzeRoutes.getCachedAnalysis();

    if (!analysis || !analysis.success) {
      return res.status(400).json({
        success: false,
        error: 'No analysis available. Please run analysis first.'
      });
    }

    const result = await generateBarChart(analysis.comparison);
    if (!result.success) {
      return res.status(400).json({
        success: false,
        error: 'Failed to generate bar chart: ' + result.error
      });
    }

    if (result.isJson) {
      res.set('Content-Type', 'application/json');
    } else {
      res.set('Content-Type', 'image/png');
    }
    res.send(result.image);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/visualize/pie
 * Generate and return pie chart
 */
router.get('/pie', async (req, res) => {
  try {
    const analysis = analyzeRoutes.getCachedAnalysis();

    if (!analysis || !analysis.success) {
      return res.status(400).json({
        success: false,
        error: 'No analysis available. Please run analysis first.'
      });
    }

    const result = await generatePieChart(
      analysis.motherData.total,
      analysis.fatherData.total
    );
    if (!result.success) {
      return res.status(400).json({
        success: false,
        error: 'Failed to generate pie chart: ' + result.error
      });
    }

    if (result.isJson) {
      res.set('Content-Type', 'application/json');
    } else {
      res.set('Content-Type', 'image/png');
    }
    res.send(result.image);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/visualize/heatmap
 * Generate and return heatmap
 */
router.get('/heatmap', async (req, res) => {
  try {
    const analysis = analyzeRoutes.getCachedAnalysis();

    if (!analysis || !analysis.success) {
      return res.status(400).json({
        success: false,
        error: 'No analysis available. Please run analysis first.'
      });
    }

    const result = await generateHeatmap(analysis.comparison);
    if (!result.success) {
      return res.status(400).json({
        success: false,
        error: 'Failed to generate heatmap: ' + result.error
      });
    }

    if (result.isJson) {
      res.set('Content-Type', 'application/json');
    } else {
      res.set('Content-Type', 'image/png');
    }
    res.send(result.image);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/visualize/configs
 * Get all chart configurations as JSON for client-side rendering
 */
router.get('/configs', (req, res) => {
  try {
    const analysis = analyzeRoutes.getCachedAnalysis();

    if (!analysis || !analysis.success) {
      return res.status(400).json({
        success: false,
        error: 'No analysis available. Please run analysis first.'
      });
    }

    const configs = getChartConfigs(analysis);
    res.json({
      success: true,
      data: configs
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
