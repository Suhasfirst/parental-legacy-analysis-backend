const express = require('express');
const router = express.Router();
const upload = require('../middleware/fileUpload');

let uploadedFilePath = null;

/**
 * POST /api/upload
 * Accept Excel file upload
 */
router.post('/', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No file uploaded'
      });
    }

    uploadedFilePath = req.file.path;

    res.json({
      success: true,
      message: 'File uploaded successfully',
      file: {
        originalName: req.file.originalname,
        savedName: req.file.filename,
        path: req.file.path,
        size: req.file.size,
        mimeType: req.file.mimetype
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
 * GET /api/upload/status
 * Get upload status
 */
router.get('/status', (req, res) => {
  res.json({
    success: true,
    uploadedFile: uploadedFilePath ? uploadedFilePath : 'No file uploaded yet'
  });
});

// Export the router and the uploadedFilePath getter
router.getUploadedFilePath = () => uploadedFilePath;
router.setUploadedFilePath = (path) => { uploadedFilePath = path; };

module.exports = router;
