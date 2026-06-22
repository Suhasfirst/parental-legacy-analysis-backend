# API Usage Examples

## Complete Workflow Example

### 1. Initialize and Upload Data

```bash
# Start the API server
npm start
```

### 2. Upload Excel File

```bash
# Using curl
curl -X POST \
  -F "file=@sample_data.xlsx" \
  http://localhost:5000/api/upload

# Response:
{
  "success": true,
  "message": "File uploaded successfully",
  "file": {
    "originalName": "sample_data.xlsx",
    "savedName": "sample_data_1687350000000.xlsx",
    "path": "D:\\Code Karma Assignment\\uploads\\sample_data_1687350000000.xlsx",
    "size": 5120,
    "mimeType": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  }
}
```

### 3. Analyze the Data

```bash
# Perform analysis
curl -X POST \
  http://localhost:5000/api/analyze

# Response includes:
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
        "health": 18,
        "spirituality": 12,
        "finances": 16,
        "personal_growth": 10,
        "relationships": 9,
        "undefined": 15  // Extra factor
      },
      "total": 115,
      "highest": {
        "factor": "health",
        "value": 18
      },
      "lowest": {
        "factor": "spirituality",
        "value": 12
      }
    },
    "fatherData": {
      "factors": {
        "career": 25,
        "family": 20,
        "health": 15,
        "spirituality": 10,
        "finances": 18,
        "personal_growth": 8,
        "relationships": 4,
        "undefined": 25  // Extra factor
      },
      "total": 125,
      "highest": {
        "factor": "undefined",
        "value": 25
      },
      "lowest": {
        "factor": "relationships",
        "value": 4
      }
    },
    "comparison": {
      "career": {
        "mother": 20,
        "father": 25,
        "difference": -5,
        "percentageDifference": -20,
        "winner": "father"
      },
      "family": {
        "mother": 15,
        "father": 20,
        "difference": -5,
        "percentageDifference": -25,
        "winner": "father"
      },
      // ... other factors
    },
    "insights": {
      "insights": [
        "Father has a higher overall total (125) compared to Mother (115).",
        "Father leads in career: 25 vs 20",
        "Father leads in family: 20 vs 15",
        // ... more insights
      ],
      "recommendations": [
        "Father demonstrates stronger presence across most life factors.",
        "Focus on areas with lower scores to achieve better balance.",
        "Maintain strengths in high-scoring factors.",
        "Consider collaborative approaches in factors where there are significant differences."
      ],
      "motherLeads": 3,
      "fatherLeads": 4
    }
  }
}
```

### 4. Get Chart Configurations

```bash
# Get chart configs for client-side rendering
curl http://localhost:5000/api/visualize/configs

# Response contains Chart.js configurations:
{
  "success": true,
  "data": {
    "barChart": {
      "type": "bar",
      "data": {
        "labels": ["Career", "Family", "Health", ...],
        "datasets": [
          {
            "label": "Mother",
            "data": [20, 15, 18, ...],
            "backgroundColor": "rgba(255, 102, 178, 0.7)",
            ...
          },
          {
            "label": "Father",
            "data": [25, 20, 15, ...],
            "backgroundColor": "rgba(102, 178, 255, 0.7)",
            ...
          }
        ]
      }
    },
    "pieChart": { ... },
    "heatmap": { ... }
  }
}
```

### 5. Generate Visualizations

```bash
# Get bar chart image (PNG or JSON)
curl http://localhost:5000/api/visualize/bar \
  --output bar_chart.png

# Get pie chart image
curl http://localhost:5000/api/visualize/pie \
  --output pie_chart.png

# Get heatmap image
curl http://localhost:5000/api/visualize/heatmap \
  --output heatmap.png
```

### 6. Generate PDF Report

```bash
# Generate comprehensive PDF report
curl http://localhost:5000/api/report \
  --output life_factors_report.pdf

# Report includes:
# - Executive summary with totals
# - Detailed breakdown for mother and father
# - Factor-by-factor comparison
# - Key insights
# - Recommendations
# - Charts and visualizations (if available)
```

### 7. Retrieve Generated Reports

```bash
# List all generated reports
curl http://localhost:5000/api/report/list

# Response:
{
  "success": true,
  "reports": [
    {
      "filename": "report_2026-06-22_1687350125000.pdf",
      "size": 45678,
      "createdAt": "2026-06-22T15:30:00.000Z",
      "path": "/api/report/download/report_2026-06-22_1687350125000.pdf"
    }
  ]
}

# Download a specific report
curl http://localhost:5000/api/report/download/report_2026-06-22_1687350125000.pdf \
  --output my_report.pdf
```

## JavaScript/Node.js Integration Example

```javascript
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

const BASE_URL = 'http://localhost:5000';

async function analyzeExcelFile(filePath) {
  try {
    // 1. Upload file
    const form = new FormData();
    form.append('file', fs.createReadStream(filePath));
    
    console.log('Uploading file...');
    const uploadResponse = await axios.post(
      `${BASE_URL}/api/upload`,
      form,
      { headers: form.getHeaders() }
    );
    
    console.log('File uploaded:', uploadResponse.data.file.filename);
    
    // 2. Analyze data
    console.log('Analyzing data...');
    const analysisResponse = await axios.post(
      `${BASE_URL}/api/analyze`
    );
    
    const analysis = analysisResponse.data.data;
    console.log(`Mother's Total: ${analysis.motherData.total}`);
    console.log(`Father's Total: ${analysis.fatherData.total}`);
    console.log(`Insights: ${analysis.insights.insights[0]}`);
    
    // 3. Get chart configs
    console.log('Fetching chart configurations...');
    const chartsResponse = await axios.get(
      `${BASE_URL}/api/visualize/configs`
    );
    
    const chartConfigs = chartsResponse.data.data;
    
    // 4. Generate PDF report
    console.log('Generating PDF report...');
    const reportResponse = await axios.get(
      `${BASE_URL}/api/report`,
      { responseType: 'arraybuffer' }
    );
    
    fs.writeFileSync('analysis_report.pdf', reportResponse.data);
    console.log('Report saved: analysis_report.pdf');
    
    return {
      analysis,
      chartConfigs,
      reportPath: 'analysis_report.pdf'
    };
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
    throw error;
  }
}

// Usage
analyzeExcelFile('sample_data.xlsx')
  .then(result => console.log('Analysis complete!'))
  .catch(err => console.error('Analysis failed:', err));
```

## Frontend Integration with Chart.js

```html
<!DOCTYPE html>
<html>
<head>
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</head>
<body>
  <div>
    <canvas id="barChart"></canvas>
    <canvas id="pieChart"></canvas>
    <canvas id="heatmap"></canvas>
  </div>

  <script>
    const BASE_URL = 'http://localhost:5000';

    // Fetch chart configurations from API
    fetch(`${BASE_URL}/api/visualize/configs`)
      .then(res => res.json())
      .then(data => {
        const configs = data.data;

        // Render bar chart
        new Chart(
          document.getElementById('barChart'),
          configs.barChart
        );

        // Render pie chart
        new Chart(
          document.getElementById('pieChart'),
          configs.pieChart
        );

        // Render heatmap
        new Chart(
          document.getElementById('heatmap'),
          configs.heatmap
        );
      });
  </script>
</body>
</html>
```

## Error Handling Examples

```bash
# Error: No file uploaded
curl -X POST http://localhost:5000/api/analyze

# Response:
{
  "success": false,
  "error": "No file uploaded. Please upload a file first."
}

# Error: Invalid file type
curl -X POST \
  -F "file=@document.txt" \
  http://localhost:5000/api/upload

# Response:
{
  "success": false,
  "error": "Only Excel files (.xlsx, .xls) are allowed"
}

# Error: File too large
# Response (if file > 10MB):
{
  "success": false,
  "error": "File too large"
}
```

## Rate Limiting & Performance Notes

- **Upload**: ~100-500ms per file
- **Analysis**: ~50-200ms
- **Chart Generation**: ~500-2000ms (depends on QuickChart API)
- **PDF Generation**: ~1-5 seconds
- **Recommended**: Implement request throttling on client side

## Environment Configuration

```bash
# .env file
PORT=5000
NODE_ENV=development

# For production:
# NODE_ENV=production
# PORT=3000
```

## Troubleshooting Common Issues

### Issue: "Cannot find module 'express'"
**Solution**: Run `npm install`

### Issue: "Port 5000 already in use"
**Solution**: 
```bash
# Change port in .env
PORT=5001
```

### Issue: "Chart request failed"
**Solution**: Charts will return JSON configs; use Chart.js on frontend

### Issue: "PDF generation timeout"
**Solution**: Generate reports asynchronously or increase timeout

## Advanced Usage

### Batch Analysis
```javascript
// Analyze multiple files sequentially
const files = ['file1.xlsx', 'file2.xlsx', 'file3.xlsx'];
const results = [];

for (const file of files) {
  // Upload and analyze each file
  const result = await analyzeExcelFile(file);
  results.push(result);
}
```

### Real-time Updates
```javascript
// Use WebSocket or polling for real-time updates
const pollAnalysis = setInterval(async () => {
  try {
    const report = await axios.get(`${BASE_URL}/api/analyze/report`);
    console.log('Latest analysis:', report.data);
  } catch (error) {
    console.error('Polling error:', error);
  }
}, 5000); // Poll every 5 seconds
```

## Documentation Resources

- **API**: See README.md
- **Testing**: See TESTING.md
- **Project**: See .github/copilot-instructions.md
