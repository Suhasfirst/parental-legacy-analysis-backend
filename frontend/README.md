# Parental Legacy Analysis - Frontend

A beautiful, responsive frontend for analyzing and comparing parental life factors. Built with modern web technologies for an excellent user experience.

## Features

✨ **Beautiful UI**
- Modern, responsive design
- Smooth animations and transitions
- Dark-friendly color scheme
- Mobile-optimized

📊 **Interactive Visualizations**
- Bar charts comparing mother vs father
- Pie charts showing contribution distribution
- Heatmaps for detailed comparisons
- Real-time chart rendering

📤 **Easy File Upload**
- Drag-and-drop file upload
- Excel file validation
- File size checking
- Progress indication

📈 **Comprehensive Analysis**
- Life factors breakdown
- Statistical comparisons
- Key insights generation
- Recommendations display

📄 **PDF Reports**
- One-click PDF generation
- Detailed analysis export
- Professional formatting

## Tech Stack

- **HTML5** - Semantic markup
- **Tailwind CSS** - Responsive styling
- **Chart.js** - Dynamic visualizations
- **Axios** - HTTP client
- **Vanilla JavaScript** - No frameworks

## Getting Started

### Local Development

1. **Clone the repository**
   ```bash
   cd frontend
   ```

2. **Start local server**
   ```bash
   # Using Python 3
   python -m http.server 8080

   # Or using Node.js
   npx http-server
   ```

3. **Open in browser**
   ```
   http://localhost:8080
   ```

### Using Live Server (VS Code)

1. Install the "Live Server" extension
2. Right-click `index.html` and select "Open with Live Server"

## Configuration

### API Base URL

The frontend is configured to use the Railway backend:
```
https://parental-legacy-analysis-backend-production.up.railway.app
```

To change the API endpoint, edit `app.js`:
```javascript
const API_BASE_URL = 'https://your-api-url.com';
```

## File Structure

```
frontend/
├── index.html          # Main HTML file
├── styles.css          # Custom styles
├── app.js              # JavaScript logic
├── package.json        # Project metadata
├── netlify.toml        # Netlify deployment config
├── vercel.json         # Vercel deployment config
└── README.md           # This file
```

## Deployment

### Option 1: Netlify

1. **Sign up at** [netlify.com](https://netlify.com)

2. **Deploy**
   ```bash
   # Option A: Drag and drop
   # Go to netlify.com/drop and drag the frontend folder

   # Option B: Git integration
   # Connect your Git repository and auto-deploy on push
   ```

3. **Configure environment**
   - Site settings → Build & deploy → Environment
   - Add `API_BASE_URL` if needed

### Option 2: Vercel

1. **Sign up at** [vercel.com](https://vercel.com)

2. **Deploy**
   ```bash
   npm i -g vercel
   vercel
   ```

3. **Follow prompts** to deploy

### Option 3: Railway

1. **Create new project** on [railway.app](https://railway.app)

2. **Connect GitHub** or upload files

3. **Configure build**
   - Build command: (leave empty)
   - Start command: `python -m http.server 8080`
   - Port: 8080

4. **Deploy**

### Option 4: GitHub Pages

1. **Push to GitHub**
   ```bash
   git push origin main
   ```

2. **Enable GitHub Pages**
   - Settings → Pages
   - Select `main` branch
   - Save

3. **Access at**
   ```
   https://yourusername.github.io/repository-name
   ```

## Usage Guide

### 1. Upload File

1. Click the dropzone or drag an Excel file
2. Supported formats: `.xlsx`, `.xls`
3. Maximum size: 10MB

### 2. View Analysis

- **Summary Cards**: Mother's and Father's totals
- **Validation Status**: Data validity check
- **Highest/Lowest**: Top and bottom life factors

### 3. Explore Visualizations

- **Bar Chart**: Compare all factors side-by-side
- **Pie Chart**: See total contribution distribution
- **Heatmap**: Detailed factor comparison

### 4. Review Comparison Table

- Factor-by-factor breakdown
- Mother vs Father scores
- Difference calculations
- Winner indicators

### 5. Read Insights

- **Key Insights**: Pattern analysis
- **Recommendations**: Actionable advice
- **Detailed Breakdown**: Individual factor scores

### 6. Download Report

- One-click PDF generation
- Professional formatting
- Includes all analysis data
- Timestamped filename

## Excel File Format

Your Excel file should have the following structure:

| Column | Type | Example |
|--------|------|---------|
| mother_career | number | 20 |
| father_career | number | 25 |
| mother_family | number | 15 |
| father_family | number | 20 |
| mother_health | number | 18 |
| father_health | number | 15 |
| mother_spirituality | number | 12 |
| father_spirituality | number | 10 |
| mother_finances | number | 16 |
| father_finances | number | 18 |
| mother_personal_growth | number | 10 |
| father_personal_growth | number | 8 |
| mother_relationships | number | 9 |
| father_relationships | number | 4 |

**Notes:**
- Values should be numeric (0-100)
- Ideally, all factors sum to ~100 per parent
- Include one row of data

## Customization

### Change Colors

Edit `styles.css` and `index.html`:
```css
/* Custom gradient */
from-blue-600 to-purple-600
```

### Modify Charts

Edit `app.js` chart rendering functions:
```javascript
barChartInstance = new Chart(ctx, {
    type: 'bar',
    data: { ... },
    options: { ... }
});
```

### Update Text

Edit labels and headers in `index.html`

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Troubleshooting

### Issue: "Failed to upload"
**Solution**: Check file format and size. Use .xlsx files preferably.

### Issue: "Charts not showing"
**Solution**: Wait for analysis to complete. Check browser console for errors.

### Issue: "PDF download fails"
**Solution**: Check that backend API is accessible. Verify CORS settings.

### Issue: "Styling looks broken"
**Solution**: Clear browser cache. Check that Tailwind CDN is loading.

## Performance Tips

- File uploads: ~2-5 seconds
- Analysis: ~1-3 seconds
- Chart rendering: ~1 second
- PDF generation: ~2-5 seconds

## API Endpoints Used

- `POST /api/upload` - Upload Excel file
- `POST /api/analyze` - Analyze data
- `GET /api/visualize/configs` - Get chart configurations
- `GET /api/report` - Download PDF report

## Environment Variables

For deployment platforms, set:

```
API_BASE_URL=https://parental-legacy-analysis-backend-production.up.railway.app
```

## Contributing

Improvements welcome! Feel free to:
- Report bugs
- Suggest features
- Improve styling
- Optimize performance

## License

ISC

## Support

For issues or questions:
1. Check the [API documentation](../README.md)
2. Review [API examples](../API_EXAMPLES.md)
3. Check browser console for errors
4. Verify backend is running

## Project Structure

```
Parental Legacy Analysis/
├── backend/          # Express.js API
├── frontend/         # This project
└── documentation/    # Guides and examples
```

## Next Steps

- [ ] Add dark mode toggle
- [ ] Implement data export (CSV, JSON)
- [ ] Add comparison between multiple analyses
- [ ] Create user accounts
- [ ] Store analysis history
- [ ] Add email report delivery

## Version History

### v1.0.0
- Initial release
- File upload functionality
- Analysis display
- Chart visualizations
- PDF report generation
- Responsive design

## Deployment Status

### Recommended Platforms

1. **Netlify** ⭐ (Easiest)
   - Free tier available
   - Git integration
   - Fast CDN

2. **Vercel** ⭐ (Fast)
   - Free tier
   - Optimized for static sites
   - Great performance

3. **Railway** ⭐ (Same as backend)
   - Pay-as-you-go
   - Easy integration
   - Good for full-stack apps

4. **GitHub Pages** (Free)
   - Free forever
   - Easy setup
   - Great for projects

## Quick Links

- [API Documentation](../README.md)
- [API Examples](../API_EXAMPLES.md)
- [Testing Guide](../TESTING.md)
- [Backend Repository](https://railway.app)

---

**Built with ❤️ for meaningful family analysis**
