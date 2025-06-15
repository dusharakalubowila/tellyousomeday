# TellYouSomeday - Final Deployment Steps

## Current Status
✅ Backend code is ready with health checks and CORS configured  
✅ Backend-only DigitalOcean configuration is committed and pushed  
✅ MongoDB Atlas is set up and accessible  
⏳ Waiting for backend deployment to complete  
⏳ Need to update frontend with correct backend URL  
⏳ Need to deploy frontend separately  

## Step 1: Deploy Backend Only

1. **Check DigitalOcean Console**
   - Go to your DigitalOcean Apps dashboard
   - Create a new app using `.do/backend-app.yaml` configuration
   - Or update existing app to use backend-only config
   - Wait for deployment to complete

2. **Get Backend URL**
   - Once deployed, note the backend URL (e.g., `https://tellyousomeday-backend-xxxxx.ondigitalocean.app`)
   - This will be different from your previous multi-service URL

3. **Test Backend**
   ```bash
   # Run the deployment test script
   node scripts/test-deployment.js https://your-backend-url-here
   ```

## Step 2: Update Frontend Configuration

1. **Update .env.production**
   ```bash
   VITE_API_URL=https://your-actual-backend-url/api
   ```

2. **Test locally with production backend**
   ```bash
   npm run build
   npm run preview
   ```

## Step 3: Deploy Frontend Separately

### Option A: DigitalOcean Static Site
1. Create a new DigitalOcean app for frontend only
2. Use this configuration:
   ```yaml
   name: tellyousomeday-frontend
   static_sites:
   - name: frontend
     source_dir: /
     github:
       repo: dusharakalubowila/tellyousomeday
       branch: main
     build_command: npm ci && npm run build
     output_dir: dist
     environment_slug: node-js
     index_document: index.html
     error_document: index.html
     envs:
     - key: VITE_API_URL
       value: https://your-backend-url/api
   ```

### Option B: Netlify (Alternative)
1. Connect GitHub repo to Netlify
2. Set build command: `npm ci && npm run build`
3. Set publish directory: `dist`
4. Set environment variable: `VITE_API_URL=https://your-backend-url/api`

### Option C: Vercel (Alternative)
1. Import GitHub repo to Vercel
2. Framework preset: Vite
3. Set environment variable: `VITE_API_URL=https://your-backend-url/api`

## Step 4: Final Testing

1. **Test API Endpoints**
   ```bash
   # Health check
   curl https://your-backend-url/api/health
   
   # Test endpoint
   curl https://your-backend-url/api/test
   
   # Messages endpoint
   curl https://your-backend-url/api/messages
   ```

2. **Test Frontend**
   - Visit your deployed frontend URL
   - Open browser console to check for API connection
   - Try creating a test message
   - Try searching for messages

## Step 5: Clean Up (Optional)

1. **Secure CORS** (after confirming everything works)
   ```javascript
   // In backend/server.js, replace:
   origin: true
   
   // With:
   origin: ['https://your-frontend-url.com']
   ```

2. **Remove debug logging** from production code

## Troubleshooting

### Backend Issues
- Check DigitalOcean app logs
- Verify MongoDB connection string
- Test health endpoints directly

### Frontend Issues
- Check browser console for API errors
- Verify VITE_API_URL in network requests
- Test API endpoints manually

### CORS Issues
- Ensure backend allows frontend domain
- Check preflight OPTIONS requests

## Quick Commands

```bash
# Test deployment script
node scripts/test-deployment.js https://your-backend-url

# Build and preview locally
npm run build && npm run preview

# Check git status
git status

# Commit and push changes
git add . && git commit -m "Update config" && git push origin main
```

## Next Immediate Action

1. **Check your DigitalOcean dashboard** for the backend app deployment status
2. **Get the actual backend URL** once it's deployed
3. **Run the test script** to verify the backend is working
4. **Update this guide** with the real URLs
