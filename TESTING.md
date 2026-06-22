# API Testing Guide

## Prerequisites
- Node.js installed
- Server running on `http://localhost:5000`

## Test Sequence

### Step 1: Start the Server
```bash
npm start
# Or for development with auto-reload
npm run dev
```

Expected output:
```
✅ Server running on http://localhost:5000
📊 API endpoints:
   POST   /api/upload - Upload Excel file
   POST   /api/analyze - Analyze data
   GET    /api/visualize/bar - Generate bar chart
   GET    /api/visualize/pie - Generate pie chart
   GET    /api/visualize/heatmap - Generate heatmap
   GET    /api/report - Generate PDF report
```

### Step 2: Health Check
```bash
curl http://localhost:5000/health
```

Expected response:
```json
{
  "status": "API is running",
  "timestamp": "2026-06-22T15:30:00.000Z"
}
```

### Step 3: Upload Excel File
```bash
curl -X POST -F "file=@sample_data.xlsx" http://localhost:5000/api/upload
```

Expected response:
```json
{
  "success": true,
  "message": "File uploaded successfully",
  "file": {
    "originalName": "sample_data.xlsx",
    "savedName": "sample_data_[timestamp].xlsx",
    "path": "D:\\...\\uploads\\...",
    "size": [size in bytes],
    "mimeType": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  }
}
```

### Step 4: Analyze Data
```bash
curl -X POST http://localhost:5000/api/analyze
```

Expected response:
```json
{
  "success": true,
  "data": {
    "validation": {
      "motherValid": true,
      "fatherValid": true,
      "motherTotal": 115,
      "fatherTotal": 125
    },
    "motherData": {
      "factors": {
        "career": 20,
        "family": 15,
        ...
      },
      "total": 115,
      "highest": { "factor": "career", "value": 20 },
      "lowest": { "factor": "relationships", "value": 9 }
    },
    "fatherData": {
      ...
    },
    "comparison": {
      "career": {
        "mother": 20,
        "father": 25,
        "difference": -5,
        "percentageDifference": -20,
        "winner": "father"
      },
      ...
    },
    "insights": {
      "insights": [...],
      "recommendations": [...],
      "motherLeads": 3,
      "fatherLeads": 4
    }
  }
}
```

### Step 5: Get Chart Configurations (JSON)
```bash
curl http://localhost:5000/api/visualize/configs
```

Expected response: Chart.js configuration objects for bar, pie, and heatmap

### Step 6: Get Charts as Images
```bash
# Bar chart
curl http://localhost:5000/api/visualize/bar -o bar_chart.png

# Pie chart  
curl http://localhost:5000/api/visualize/pie -o pie_chart.png

# Heatmap
curl http://localhost:5000/api/visualize/heatmap -o heatmap.png
```

Expected: PNG image files (or JSON if QuickChart API is unavailable)

### Step 7: Generate PDF Report
```bash
curl http://localhost:5000/api/report -o report.pdf
```

Expected: PDF file with analysis summary, comparisons, insights, and recommendations

### Step 8: List Generated Reports
```bash
curl http://localhost:5000/api/report/list
```

Expected response:
```json
{
  "success": true,
  "reports": [
    {
      "filename": "report_2026-06-22_[timestamp].pdf",
      "size": [size in bytes],
      "createdAt": "[ISO date]",
      "path": "/api/report/download/..."
    }
  ]
}
```

## Testing with Postman

### Collection Setup

1. **Create new Postman Collection**: "Excel Analysis API"

2. **Add requests**:
   - **Health Check** (GET) `http://localhost:5000/health`
   - **Upload File** (POST) `http://localhost:5000/api/upload`
     - Body: form-data with key "file"
     - Value: select sample_data.xlsx
   - **Analyze** (POST) `http://localhost:5000/api/analyze`
   - **Get Charts Config** (GET) `http://localhost:5000/api/visualize/configs`
   - **Bar Chart** (GET) `http://localhost:5000/api/visualize/bar`
   - **Pie Chart** (GET) `http://localhost:5000/api/visualize/pie`
   - **Heatmap** (GET) `http://localhost:5000/api/visualize/heatmap`
   - **Report** (GET) `http://localhost:5000/api/report`
   - **List Reports** (GET) `http://localhost:5000/api/report/list`

## Expected Data Format

### Sample Excel File Structure
```
| mother_career | father_career | mother_family | father_family | ... |
|      20       |      25       |      15       |      20       | ... |
```

### 7 Life Factors (Required Columns)
- career
- family
- health
- spirituality
- finances
- personal_growth
- relationships

### Data Requirements
- Must have columns for mother and father versions of each factor
- Values should be numeric (0-100 range recommended)
- Ideally, all factors sum close to 100 for each parent

## Troubleshooting

### Port Already in Use
```bash
# Find process using port 5000
netstat -ano | findstr :5000

# Kill the process (Windows)
taskkill /PID [PID] /F
```

### File Upload Fails
- Ensure file is in .xlsx format
- File size should not exceed 10MB
- Use `POST /api/upload` not GET

### Charts Return JSON Instead of Images
- QuickChart API is not available
- Use the JSON configs with Chart.js on the frontend
- Endpoint: `/api/visualize/configs`

### Analysis Returns Error
- Ensure file was uploaded first
- Run `/api/upload` before `/api/analyze`
- Check file has correct column names

## Performance Notes
- First analysis may take longer if chart generation is enabled
- PDF generation is synchronous and may take 2-5 seconds
- QuickChart API calls (if available) add ~1-2 seconds

## Next Steps
- Integrate with frontend using Chart.js
- Set up database to persist analyses
- Add user authentication
- Implement email report delivery
