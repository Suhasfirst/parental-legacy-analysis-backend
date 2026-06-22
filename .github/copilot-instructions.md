<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

- [x] Verify that the copilot-instructions.md file in the .github directory is created.
- [x] Clarify Project Requirements - Node.js/Express.js API for Excel analysis with 4 endpoints (upload, analyze, visualize, report)
- [x] Scaffold the Project - Project structure created with routes, utils, middleware, and necessary directories
- [x] Customize the Project - All endpoints implemented with Excel parsing, data analysis, chart generation, and PDF reporting
- [x] Install Required Extensions - No extensions needed for Node.js project
- [x] Compile the Project - Dependencies installed successfully, server tested and running
- [x] Create and Run Task - npm start task configured in package.json
- [x] Launch the Project - Server running on http://localhost:5000
- [x] Ensure Documentation is Complete - README.md and TESTING.md created

## Project Summary

**Project Type**: Node.js/Express.js REST API

**Purpose**: Excel file upload, analysis, visualization, and PDF report generation

**Status**: ✅ COMPLETE - All features implemented and tested

## API Endpoints

### Implemented Endpoints

1. **POST /api/upload** - Upload Excel file
   - Accepts .xlsx and .xls files
   - Max file size: 10MB
   - Returns file information and path

2. **POST /api/analyze** - Analyze uploaded data
   - Validates data structure
   - Calculates mother's and father's totals
   - Identifies highest/lowest factors
   - Compares factors between parents
   - Generates insights and recommendations

3. **GET /api/visualize/bar** - Bar chart comparison
4. **GET /api/visualize/pie** - Pie chart distribution
5. **GET /api/visualize/heatmap** - Heatmap comparison
6. **GET /api/visualize/configs** - Chart configs as JSON

7. **GET /api/report** - Generate PDF report
8. **GET /api/report/list** - List all reports
9. **GET /api/report/download/:filename** - Download specific report

### Support Endpoints

- **GET /health** - API health check
- **GET /api/upload/status** - Upload status
- **GET /api/analyze/report** - Get cached analysis

## Tech Stack

- **Express.js** - Web framework
- **Multer** - File uploads
- **XLSX** - Excel reading
- **PDFKit** - PDF generation
- **Axios** - HTTP client for QuickChart API
- **Chart.js** - Chart definitions
- **CORS** - Cross-origin support

## File Structure

```
d:\Code Karma Assignment\
├── server.js                      # Main entry point
├── package.json                   # Dependencies
├── .env                           # Environment variables
├── .gitignore                     # Git ignore rules
├── README.md                      # Project documentation
├── TESTING.md                     # Testing guide
├── .github/
│   └── copilot-instructions.md   # This file
├── routes/
│   ├── upload.js                 # Upload endpoint
│   ├── analyze.js                # Analysis endpoint
│   ├── visualize.js              # Chart endpoints
│   └── report.js                 # Report generation
├── utils/
│   ├── excelParser.js            # Excel file parsing
│   ├── analyzer.js               # Data analysis logic
│   ├── chartGenerator.js         # Chart generation
│   └── reportGenerator.js        # PDF report generation
├── middleware/
│   └── fileUpload.js             # Multer configuration
├── uploads/                      # Uploaded files directory
├── reports/                      # Generated reports directory
└── sample_data.xlsx              # Test file

## Installation & Running

### Development
```bash
npm install
npm run dev
```

### Production
```bash
npm install
npm start
```

Server runs on: http://localhost:5000

## Sample Data Format

Excel file with columns for 7 life factors (mother and father versions):
- mother_career, father_career
- mother_family, father_family
- mother_health, father_health
- mother_spirituality, father_spirituality
- mother_finances, father_finances
- mother_personal_growth, father_personal_growth
- mother_relationships, father_relationships

Values: numeric (0-100 range), ideally sum to ~100

## Testing

See [TESTING.md](TESTING.md) for comprehensive testing guide with curl examples and expected responses.

Quick test:
```bash
# Terminal 1: Start server
npm start

# Terminal 2: Test upload
curl -X POST -F "file=@sample_data.xlsx" http://localhost:5000/api/upload

# Analyze
curl -X POST http://localhost:5000/api/analyze

# Generate report
curl http://localhost:5000/api/report -o report.pdf
```

## Key Features

✅ **File Upload** - Support for Excel files with validation
✅ **Data Analysis** - Comprehensive analysis of life factors
✅ **Data Validation** - Check totals and validate structure
✅ **Comparisons** - Mother vs Father across all factors
✅ **Insights** - AI-generated insights and recommendations
✅ **Visualizations** - Bar charts, pie charts, heatmaps
✅ **PDF Reports** - Complete reports with analysis
✅ **Error Handling** - Comprehensive error responses
✅ **Documentation** - README, TESTING guide, API docs

## Notes

- Chart generation uses QuickChart API (with JSON fallback)
- PDF reports contain comprehensive analysis and statistics
- All endpoints return structured JSON responses
- File upload includes security checks and size limits
- Analysis results are cached for chart/report generation

