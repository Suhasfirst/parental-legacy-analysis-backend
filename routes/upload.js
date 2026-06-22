const express = require('express');
const router = express.Router();
const upload = require('../middleware/fileUpload');
const fs = require('fs');

let uploadedFilePath = null;

/**
 * POST /api/upload
 * Accept Excel file upload
 */
router.post('/', (req, res, next) => {
  upload.single('file')(req, res, (err) => {
    // Handle multer errors
    if (err) {
      console.error('Multer error:', err);
      
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
          success: false,
          error: 'File size exceeds 10MB limit'
        });
      }
      
      if (err.code === 'LIMIT_PART_COUNT') {
        return res.status(400).json({
          success: false,
          error: 'Too many parts in upload'
        });
      }
      
      if (err.message && err.message.includes('Only Excel')) {
        return res.status(400).json({
          success: false,
          error: err.message
        });
      }
      
      return res.status(500).json({
        success: false,
        error: 'File upload failed: ' + err.message
      });
    }

    // Handle successful upload
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          error: 'No file uploaded'
        });
      }

      // Verify file was actually saved
      if (!fs.existsSync(req.file.path)) {
        return res.status(500).json({
          success: false,
          error: 'File upload failed: could not save file'
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
      console.error('Upload handler error:', error);
      res.status(500).json({
        success: false,
        error: 'Upload processing failed: ' + error.message
      });
    }
  });
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
