import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import cron from 'node-cron';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import messageRoutes from './routes/messages.js';
import { sendScheduledMessages } from './services/emailService.js';

// ES modules compatibility
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: true, // Allow all origins for now
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Database connection
console.log('🔄 Connecting to MongoDB...');
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/tellyousomeday')
.then(() => {
  console.log('✅ Connected to MongoDB');
  console.log(`📊 Database: ${mongoose.connection.db.databaseName}`);
})
.catch((err) => {
  console.error('❌ MongoDB connection error:', err);
  console.error('🔍 Connection URI:', process.env.MONGODB_URI ? 'Set' : 'Not set');
});

// API Routes (must be before static files)
app.use('/api/messages', messageRoutes);

// Health check
app.get('/api/health', async (req, res) => {
  try {
    // Test database connection
    const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
    const dbName = mongoose.connection.db ? mongoose.connection.db.databaseName : 'unknown';
    
    res.status(200).json({ 
      status: 'OK', 
      message: 'TellYouSomeday API is running',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      database: {
        status: dbStatus,
        name: dbName
      },
      port: PORT
    });
  } catch (error) {
    res.status(500).json({
      status: 'ERROR',
      message: 'Health check failed',
      error: error.message
    });
  }
});

// Root health check (backup)
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'TellYouSomeday API is running' 
  });
});

// Simple test endpoint
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'Backend API is working!',
    timestamp: new Date().toISOString(),
    cors: 'enabled',
    mode: 'fullstack'
  });
});

// Serve static files from React build
// Try multiple possible paths for the dist folder
const possibleDistPaths = [
  '/workspace/dist',                            // Absolute workspace path (DigitalOcean)
  path.join(__dirname, 'public'),               // backend/public (copied during build)
  path.join(__dirname, '..', 'dist'),           // ../dist from backend folder
  path.join(process.cwd(), 'dist'),             // dist from current working directory
  path.join(__dirname, '..', '..', 'dist'),     // ../../dist (if nested deeper)
  'dist'                                        // Relative dist
];

let staticPath = null;

console.log('🔍 Searching for dist folder in multiple locations...');
for (const distPath of possibleDistPaths) {
  console.log(`   Checking: ${distPath}`);
  try {
    if (fs.existsSync(distPath)) {
      const indexPath = path.join(distPath, 'index.html');
      if (fs.existsSync(indexPath)) {
        staticPath = distPath;
        console.log(`✅ Found valid dist folder: ${staticPath}`);
        break;
      } else {
        console.log(`   - Folder exists but no index.html`);
      }
    } else {
      console.log(`   - Path does not exist`);
    }
  } catch (error) {
    console.log(`   - Error checking path: ${error.message}`);
  }
}

if (!staticPath) {
  console.log('❌ No valid dist folder found! Creating fallback response.');
  staticPath = possibleDistPaths[0]; // Use first path as fallback
}

console.log('📂 Using static path:', staticPath);
app.use(express.static(staticPath));

// Catch all handler: send back React's index.html file for any non-API routes
app.get('*', (req, res) => {
  // Don't serve index.html for API routes that don't exist
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ error: 'API route not found' });
  }
  
  const indexPath = path.join(staticPath, 'index.html');
  console.log('📄 Serving index.html for route:', req.path);
  console.log('📂 Index file path:', indexPath);
    // Check if index.html exists
  try {
    if (fs.existsSync(indexPath)) {
      res.sendFile(indexPath);
    } else {
      console.log('❌ index.html not found at:', indexPath);
      res.status(500).json({ 
        error: 'Frontend not built', 
        message: 'React app build files not found',
        path: indexPath 
      });
    }
  } catch (error) {
    console.error('❌ Error serving index.html:', error.message);
    res.status(500).json({ 
      error: 'File serving error', 
      message: error.message 
    });
  }
});

// Scheduled job to send messages (runs every hour)
cron.schedule('0 * * * *', () => {
  console.log('🕐 Running scheduled message check...');
  try {
    sendScheduledMessages();
  } catch (error) {
    console.error('❌ Error in scheduled message service:', error.message);
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 TellYouSomeday Full-Stack App running on port ${PORT}`);
  console.log(`📱 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🏥 Health check available at: /api/health`);
  console.log(`🌐 CORS enabled for: ${process.env.FRONTEND_URL || 'all origins'}`);
  console.log(`🔗 MongoDB URI: ${process.env.MONGODB_URI ? 'Set' : 'Not set'}`);
  console.log(`🔑 JWT Secret: ${process.env.JWT_SECRET ? 'Set' : 'Not set'}`);
  console.log(`📂 Serving React app from: ${staticPath}`);
  
  // Test MongoDB connection
  if (mongoose.connection.readyState === 1) {
    console.log('✅ MongoDB connection established');
  } else {
    console.log('⚠️ MongoDB connection not ready');
  }
  
  // Give the server a moment to fully initialize
  setTimeout(() => {
    console.log(`✅ Server fully initialized and ready for health checks`);
    console.log(`📍 Available endpoints:`);
    console.log(`   GET / - React App (Frontend)`);
    console.log(`   GET /health - Health check`);
    console.log(`   GET /api/health - Main health check`);
    console.log(`   GET /api/test - Test endpoint`);
    console.log(`   POST /api/messages - Create message`);
    console.log(`   GET /api/messages - Get messages`);
    console.log(`   GET /* - React App (SPA routing)`);
  }, 2000);
});

export default app;
