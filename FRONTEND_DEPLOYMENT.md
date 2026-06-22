# 🚀 Frontend Deployment Guide

## Quick Start

The frontend is a **static HTML/CSS/JS application** that works with your Railway-deployed backend.

### Local Testing

```bash
# Navigate to frontend folder
cd frontend

# Option 1: Using Python
python -m http.server 8080

# Option 2: Using Node.js
npx http-server

# Open browser
http://localhost:8080
```

## Deployment Options

### 🌟 Option 1: Netlify (Recommended - Easiest)

**Time: 2 minutes**

1. **Go to** [netlify.com/drop](https://netlify.com/drop)

2. **Drag and drop** the `frontend` folder

3. **Automatic deployment** - Your site is live!

**Features:**
- Free tier
- Auto-deploy on Git push
- Custom domain support
- SSL included

**Custom Domain:**
- Site settings → Custom domain → Enter your domain
- Update DNS records as instructed

### 🚀 Option 2: Vercel

**Time: 3 minutes**

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy**
   ```bash
   cd frontend
   vercel
   ```

3. **Follow prompts** and your site is live

**Features:**
- Free tier
- Lightning fast
- Git integration
- Automatic HTTPS

### 🚂 Option 3: Railway (Same as Backend)

**Time: 5 minutes**

1. **Create new project** on [railway.app](https://railway.app)

2. **Connect your GitHub repo** with the frontend folder

3. **Configure**
   - Build command: (leave empty)
   - Start command: `python -m http.server 8080`
   - Port: 8080

4. **Deploy** - Railway handles it automatically

### 📘 Option 4: GitHub Pages (Free)

**Time: 2 minutes**

1. **Create `gh-pages` branch**
   ```bash
   git checkout -b gh-pages
   cp -r frontend/* .
   git add .
   git commit -m "Deploy frontend"
   git push origin gh-pages
   ```

2. **Enable GitHub Pages**
   - Repository → Settings → Pages
   - Select `gh-pages` branch
   - Click Save

3. **Access your site**
   ```
   https://yourusername.github.io/repository-name
   ```

## Configuration

### Change Backend URL

If your backend URL changes, edit `frontend/app.js`:

```javascript
// Line 1
const API_BASE_URL = 'https://your-new-api-url.com';
```

## Deployment Checklist

- [ ] Frontend folder contains: index.html, app.js, styles.css
- [ ] Backend API URL is correct in app.js
- [ ] Backend is running and accessible
- [ ] File upload endpoint works (`/api/upload`)
- [ ] Analysis endpoint works (`/api/analyze`)
- [ ] Report endpoint works (`/api/report`)

## Testing After Deployment

1. **Visit your deployed URL**
2. **Try file upload**
3. **Check console for errors** (F12)
4. **Download a report** to verify PDF generation

## Troubleshooting

### Issue: CORS Error
**Error:** `Access to XMLHttpRequest blocked by CORS`

**Solution:** Backend needs CORS enabled
- Check backend has `cors` middleware
- Backend is working: `https://parental-legacy-analysis-backend-production.up.railway.app/health`

### Issue: File Upload Fails
**Error:** `Failed to upload`

**Solution:**
- Check backend API is running
- Verify API URL in app.js is correct
- Check file format (.xlsx)

### Issue: Charts Not Showing
**Error:** Blank chart areas

**Solution:**
- Check browser console (F12 → Console)
- Verify Chart.js is loading from CDN
- Check JavaScript errors

### Issue: Blank Page
**Error:** Nothing loads

**Solution:**
- Check index.html exists in deployment
- Clear browser cache (Ctrl+Shift+Delete)
- Check deployment build logs

## Performance Optimization

### Already Optimized
- ✅ CSS from CDN
- ✅ Chart.js from CDN
- ✅ Minified Tailwind
- ✅ Lazy loading charts

### For Production
```html
<!-- In index.html head -->
<meta name="theme-color" content="#3b82f6">
<link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>👨‍👩‍👧</text></svg>">
```

## Advanced: Custom Domain

### Netlify
1. Site settings → Domain settings
2. Add custom domain
3. Update DNS (instructions provided)

### Vercel
1. Project settings → Domains
2. Add domain
3. Configure DNS

### Railway
1. Custom domain option
2. Configure DNS records
3. SSL auto-enabled

## Environment Setup

If you need environment variables:

### For Netlify
```
Site Settings → Build & Deploy → Environment
Add: API_BASE_URL = https://your-api.com
```

### For Vercel
```
Project Settings → Environment Variables
Add: API_BASE_URL = https://your-api.com
```

Then update app.js:
```javascript
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:5000';
```

## CI/CD Pipeline

### Auto-deploy on Git Push

**Netlify:**
```yaml
# .netlify/functions/index.js (optional)
# Netlify auto-builds on push
```

**Vercel:**
```yaml
# vercel.json already configured
# Auto-deploys on push
```

**GitHub Pages:**
```yaml
# .github/workflows/deploy.yml
name: Deploy
on: [push]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./frontend
```

## Monitoring

### Check if Site is Up
```bash
curl https://your-deployed-site.com

# Should return HTML content
```

### Check Backend Connection
```bash
curl https://your-api.com/health

# Should return {"status": "API is running"}
```

## Rollback

### Netlify
- Go to Deploys
- Click "Publish" on previous version

### Vercel
- Go to Deployments
- Click the previous deployment
- Click "Promote to Production"

### GitHub Pages
- Push new code to gh-pages branch
- Automatic rollback via git revert

## Support URLs

- **Backend Health:** [https://parental-legacy-analysis-backend-production.up.railway.app/health](https://parental-legacy-analysis-backend-production.up.railway.app/health)
- **API Upload:** [https://parental-legacy-analysis-backend-production.up.railway.app/api/upload](https://parental-legacy-analysis-backend-production.up.railway.app/api/upload)

## Next Steps

1. ✅ Deploy frontend to chosen platform
2. ✅ Test file upload functionality
3. ✅ Verify chart rendering
4. ✅ Check PDF generation
5. ✅ Set up custom domain (optional)
6. ✅ Monitor deployment

## File Structure After Deployment

```
your-deployment-url/
├── index.html
├── styles.css
├── app.js
└── favicon.ico (optional)
```

## Success Indicators

- ✅ Site loads without errors
- ✅ File upload works
- ✅ Charts render
- ✅ PDF downloads
- ✅ No console errors

## Additional Resources

- [Netlify Docs](https://docs.netlify.com)
- [Vercel Docs](https://vercel.com/docs)
- [Railway Docs](https://docs.railway.app)
- [GitHub Pages Docs](https://pages.github.com)

---

**Your frontend is now ready to deploy! 🎉**

Choose your platform and follow the steps above.
