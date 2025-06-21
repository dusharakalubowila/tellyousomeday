# 🔧 Deployment Error Fix Guide

## Error: Non-Zero Exit Code

This error means the build or startup process failed. Let's diagnose and fix it step by step.

## Step 1: Check the Logs (URGENT)

In your DigitalOcean dashboard:
1. Click on your app (should be named something like "tellyousomeday-fresh")
2. Go to the **"Runtime Logs"** tab
3. Look for **red error messages** or **failed commands**

**Common errors to look for:**
- `npm ERR!` - Package installation failed
- `Module not found` - Missing dependencies
- `Permission denied` - File access issues
- `Port already in use` - Port configuration issues
- `MongoDB connection failed` - Database issues

## Step 2: Most Likely Fixes

### Fix 1: Update App Spec Configuration
The most common issue is incorrect build configuration. Let's use our optimized config.

**In DigitalOcean Dashboard:**
1. Go to your app
2. Click **"Settings"** tab
3. Click **"Edit App Spec"**
4. **Replace everything** with this corrected configuration:

```yaml
name: tellyousomeday-fresh
services:
- name: web
  source_dir: /
  github:
    repo: dusharakalubowila/tellyousomeday
    branch: main
    deploy_on_push: true
  build_command: |
    echo "Starting build process..."
    npm ci --verbose
    echo "Building frontend..."
    npm run build
    echo "Installing backend dependencies..."
    cd backend
    npm ci --only=production --verbose
    echo "Build complete!"
  run_command: node backend/server-with-static.js
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
  http_port: 8080
  health_check:
    http_path: /api/health
    initial_delay_seconds: 60
    period_seconds: 10
    timeout_seconds: 10
    failure_threshold: 5
    success_threshold: 1
  envs:
  - key: NODE_ENV
    value: production
  - key: PORT
    value: "8080"
  - key: MONGODB_URI
    value: mongodb+srv://tellyousomeday-admin:Dkk%40320909@tellyousomeday-cluster.8j0bf4b.mongodb.net/tellyousomeday?retryWrites=true&w=majority&appName=tellyousomeday-cluster
  - key: JWT_SECRET
    value: tellyousomeday-super-secret-jwt-key-production-2025
  - key: FRONTEND_URL
    value: "*"
```

### Fix 2: Common Build Issues

If the logs show specific errors:

**"npm ERR! peer dep missing"**
- Add `--legacy-peer-deps` to npm commands

**"Module not found"**
- Missing dependencies in package.json

**"Permission denied"**
- File permission issues

**"Port issues"**
- Wrong port configuration

### Fix 3: Alternative Simpler Configuration

If the above doesn't work, try this minimal config:

```yaml
name: tellyousomeday-simple
services:
- name: web
  source_dir: /
  github:
    repo: dusharakalubowila/tellyousomeday
    branch: main
    deploy_on_push: true
  build_command: npm ci && npm run build && cd backend && npm ci --only=production
  run_command: node backend/server-with-static.js
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
  http_port: 8080
  envs:
  - key: NODE_ENV
    value: production
  - key: PORT
    value: "8080"
  - key: MONGODB_URI
    value: mongodb+srv://tellyousomeday-admin:Dkk%40320909@tellyousomeday-cluster.8j0bf4b.mongodb.net/tellyousomeday?retryWrites=true&w=majority&appName=tellyousomeday-cluster
```

## Step 3: Redeploy

After updating the configuration:
1. Click **"Save"**
2. The app should automatically redeploy
3. Watch the **"Activity"** tab for progress
4. Check **"Runtime Logs"** for any new errors

## Step 4: If Still Failing

Let me know what specific error you see in the logs, and I'll provide a targeted fix.

**Next:** Please check the logs and tell me what error messages you see!
