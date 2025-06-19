# Backend Troubleshooting Guide

## ✅ Issues Fixed (June 19, 2025)

### 1. **Deprecated MongoDB Options**
- **Problem**: Using deprecated `useNewUrlParser` and `useUnifiedTopology` options
- **Solution**: Removed deprecated options from mongoose.connect()
- **Status**: ✅ Fixed

### 2. **Duplicate Schema Index Warning**
- **Problem**: Duplicate index on `searchableText` field (both `index: true` and explicit index)
- **Solution**: Removed `index: true` from schema field definition
- **Status**: ✅ Fixed

### 3. **Port Conflicts**
- **Problem**: Port 5000 already in use
- **Solution**: Kill existing processes using port 5000
- **Status**: ✅ Fixed

### 4. **Missing Debug Information**
- **Problem**: Limited logging for deployment debugging
- **Solution**: Added comprehensive logging and health checks
- **Status**: ✅ Fixed

## 🔧 Backend Configuration Improvements

### 1. **Enhanced Health Check**
- Now includes database connection status
- Shows environment variables status
- Provides detailed endpoint information

### 2. **Better Logging**
- Detailed startup logs
- Environment variable status
- MongoDB connection status
- Available endpoints list

### 3. **Improved DigitalOcean Config**
- Uses `npm start` instead of direct `node server.js`
- Added health check endpoint configuration
- Uses production-only dependencies

## 🚀 Deployment Status

### Current State
- ✅ Backend works perfectly locally
- ✅ All endpoints respond correctly
- ✅ Health checks comprehensive
- ✅ Code pushed to GitHub
- ⏳ DigitalOcean deployment in progress

### Next Steps

1. **Check DigitalOcean Deployment**
   - Go to DigitalOcean Apps dashboard
   - Check deployment logs for the backend app
   - Look for any errors or warnings

2. **Test Deployed Backend**
   ```bash
   # Replace with your actual backend URL
   node scripts/test-deployment.js https://your-backend-url.ondigitalocean.app
   ```

3. **Common Issues to Watch For**
   - MongoDB connection errors (check logs)
   - Port binding issues
   - Environment variable problems
   - Build/dependency errors

## 🔍 Debugging Commands

### Local Testing
```bash
# Test backend locally
cd backend
npm start

# Test health endpoint
curl http://localhost:5000/api/health

# Test all endpoints
curl http://localhost:5000/
curl http://localhost:5000/health
curl http://localhost:5000/api/health
curl http://localhost:5000/api/test
```

### Production Testing
```bash
# Test with deployment script
node scripts/test-deployment.js https://your-backend-url

# Manual endpoint testing
curl https://your-backend-url/api/health
curl https://your-backend-url/api/test
```

## 📊 Expected Health Check Response

```json
{
  "status": "OK",
  "message": "TellYouSomeday API is running",
  "timestamp": "2025-06-19T16:01:09.539Z",
  "uptime": 14.1817566,
  "environment": "production",
  "database": {
    "status": "connected",
    "name": "tellyousomeday"
  },
  "port": 8080
}
```

## 🐛 Common DigitalOcean Issues

### 1. **Build Failures**
- Check if `package.json` has all required dependencies
- Verify Node.js version compatibility
- Check for syntax errors in server.js

### 2. **Runtime Errors**
- Check environment variables are set correctly
- Verify MongoDB connection string
- Check port configuration (should be 8080 for DigitalOcean)

### 3. **Health Check Failures**
- Ensure `/api/health` endpoint is accessible
- Check if server is binding to correct port
- Verify no startup errors in logs

## 📋 Checklist for Successful Deployment

- [ ] Code pushed to GitHub
- [ ] DigitalOcean app uses `backend-app.yaml` configuration
- [ ] Environment variables are set correctly
- [ ] MongoDB connection string is valid
- [ ] Health check endpoint responds
- [ ] All test endpoints work
- [ ] No errors in deployment logs

## 🆘 If Backend Still Doesn't Work

### Check These:

1. **DigitalOcean Logs**
   - Look for startup errors
   - Check MongoDB connection messages
   - Verify port binding

2. **Environment Variables**
   - Ensure all required env vars are set
   - Check MongoDB URI format
   - Verify JWT secret is set

3. **Network Issues**
   - Test endpoints directly
   - Check CORS settings
   - Verify routing configuration

### Get Help:
- Share DigitalOcean deployment logs
- Run the test deployment script
- Check browser console for errors

## 🎯 Success Indicators

When backend is working correctly:
- ✅ Health check returns 200 OK
- ✅ Database status shows "connected"
- ✅ All endpoints respond
- ✅ No errors in logs
- ✅ Frontend can connect to API
