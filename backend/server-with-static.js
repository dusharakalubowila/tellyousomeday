import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import cron from 'node-cron';
import path from 'path';
import fs from 'fs';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import { fileURLToPath } from 'url';
import messageRoutes from './routes/messages.js';
import { sendScheduledMessages, testEmailConfig } from './services/emailService.js';
import { generalLimiter } from './middleware/rateLimiter.js';
import { logger, requestLogger, logError } from './utils/logger.js';

// ES modules compatibility
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Request logging
app.use(requestLogger);

// Security Middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https:"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'", "https:"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
  crossOriginEmbedderPolicy: false
}));

// Sanitize MongoDB queries
app.use(mongoSanitize());

// General rate limiting
app.use('/api', generalLimiter);

// CORS configuration
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://tellyousomeday.com', 'https://www.tellyousomeday.com']
    : true, // Allow all origins in development
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Body parsing middleware
app.use(express.json({ 
  limit: '10mb',
  verify: (req, res, buf) => {
    try {
      JSON.parse(buf);
    } catch (e) {
      res.status(400).json({ error: 'Invalid JSON' });
      throw new Error('Invalid JSON');
    }
  }
}));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Database connection
logger.info('🔄 Connecting to MongoDB...');
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/tellyousomeday')
.then(() => {
  logger.info('✅ Connected to MongoDB', {
    database: mongoose.connection.db.databaseName,
    host: mongoose.connection.host,
    port: mongoose.connection.port
  });
})
.catch((err) => {
  logger.error('❌ MongoDB connection error', {
    error: err.message,
    uri: process.env.MONGODB_URI ? 'configured' : 'not configured'
  });
});

// API Routes (must be before static files)
app.use('/api/messages', messageRoutes);

// Enhanced health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    const healthCheck = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      services: {}
    };

    // Check database connection
    try {
      const dbStatus = mongoose.connection.readyState;
      const dbStates = ['disconnected', 'connected', 'connecting', 'disconnecting'];
      
      healthCheck.services.database = {
        status: dbStatus === 1 ? 'healthy' : 'unhealthy',
        state: dbStates[dbStatus] || 'unknown',
        host: mongoose.connection.host,
        name: mongoose.connection.name
      };

      if (dbStatus === 1) {
        // Test database query
        await mongoose.connection.db.admin().ping();
        healthCheck.services.database.ping = 'successful';
      }
    } catch (dbError) {
      healthCheck.services.database = {
        status: 'unhealthy',
        error: dbError.message
      };
      healthCheck.status = 'degraded';
    }

    // Check email service
    try {
      const emailTest = await testEmailConfig();
      healthCheck.services.email = {
        status: emailTest.success ? 'healthy' : 'unhealthy',
        configured: !!process.env.SMTP_USER,
        message: emailTest.message
      };
    } catch (emailError) {
      healthCheck.services.email = {
        status: 'unhealthy',
        configured: !!process.env.SMTP_USER,
        error: emailError.message
      };
    }

    // Memory usage
    const memUsage = process.memoryUsage();
    healthCheck.system = {
      memory: {
        used: `${Math.round(memUsage.heapUsed / 1024 / 1024)}MB`,
        total: `${Math.round(memUsage.heapTotal / 1024 / 1024)}MB`,
        external: `${Math.round(memUsage.external / 1024 / 1024)}MB`
      },
      uptime: `${Math.floor(process.uptime())}s`,
      nodeVersion: process.version
    };

    // Set appropriate status code
    const statusCode = healthCheck.status === 'healthy' ? 200 : 503;
    
    res.status(statusCode).json(healthCheck);

  } catch (error) {
    logger.error('Health check failed', { error: error.message });
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error.message
    });
  }
});

// System information endpoint (for admin/monitoring)
app.get('/api/system/info', async (req, res) => {
  try {
    const systemInfo = {
      server: {
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        cpu: process.cpuUsage(),
        platform: process.platform,
        nodeVersion: process.version,
        environment: process.env.NODE_ENV
      },
      database: {
        status: mongoose.connection.readyState,
        host: mongoose.connection.host,
        name: mongoose.connection.name,
        collections: Object.keys(mongoose.connection.collections)
      },
      configuration: {
        port: PORT,
        corsEnabled: true,
        emailConfigured: !!process.env.SMTP_USER,
        mongodbConfigured: !!process.env.MONGODB_URI
      }
    };

    res.json({
      success: true,
      data: systemInfo,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    logger.error('System info request failed', { error: error.message });
    res.status(500).json({
      error: 'Failed to get system information',
      message: error.message
    });
  }
});

// Simple test endpoint
app.get('/api/test', (req, res) => {
  logger.info('Test endpoint accessed', { 
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });
  
  res.json({
    message: 'TellYouSomeday API is working! 🚀',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    version: '2.0.0'
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

// Enhanced scheduled message processing with logging
cron.schedule('*/5 * * * *', async () => {
  logger.info('🕐 Running scheduled message check...');
  
  try {
    const result = await sendScheduledMessages();
    
    if (result.total > 0) {
      logger.info('📧 Scheduled messages processing completed', {
        total: result.total,
        processed: result.processed,
        errors: result.errors
      });
    }
  } catch (error) {
    logger.error('❌ Error in scheduled message cron job', {
      error: error.message,
      stack: error.stack
    });
  }
});

// Global error handling middleware
app.use((error, req, res, next) => {
  logError(error, req);
  
  // Don't leak error details in production
  const isDevelopment = process.env.NODE_ENV !== 'production';
  
  res.status(error.status || 500).json({
    error: 'Internal server error',
    message: isDevelopment ? error.message : 'Something went wrong',
    ...(isDevelopment && { stack: error.stack }),
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use('*', (req, res) => {
  // Don't log 404s for static assets
  if (!req.originalUrl.includes('/api/')) {
    return res.status(404).sendFile(path.join(staticPath, 'index.html'));
  }
  
  logger.warn('404 API endpoint not found', {
    method: req.method,
    url: req.originalUrl,
    ip: req.ip
  });
  
  res.status(404).json({
    error: 'Endpoint not found',
    message: `Cannot ${req.method} ${req.originalUrl}`,
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  logger.info('🚀 TellYouSomeday Full-Stack App started successfully', {
    port: PORT,
    environment: process.env.NODE_ENV || 'development',
    staticPath,
    corsOrigins: process.env.NODE_ENV === 'production' 
      ? ['https://tellyousomeday.com', 'https://www.tellyousomeday.com']
      : 'all origins',
    mongodbUri: process.env.MONGODB_URI ? 'configured' : 'using default',
    emailService: process.env.SMTP_USER ? 'configured' : 'not configured'
  });
  
  console.log(`🚀 TellYouSomeday Full-Stack App running on port ${PORT}`);
  console.log(`📱 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🏥 Health check available at: /api/health`);
  console.log(`🌐 CORS enabled for: ${process.env.NODE_ENV === 'production' ? 'production domains' : 'all origins'}`);
  console.log(`🔗 MongoDB URI: ${process.env.MONGODB_URI ? 'configured' : 'using default'}`);
  console.log(`🔑 JWT Secret: ${process.env.JWT_SECRET ? 'configured' : 'not configured'}`);
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
    console.log(`   GET /api/health - Comprehensive health check`);
    console.log(`   GET /api/system/info - System information`);
    console.log(`   GET /api/test - Test endpoint`);
    console.log(`   GET /api/messages/trending - Trending searches`);
    console.log(`   GET /api/messages/search/:name - Search messages`);
    console.log(`   POST /api/messages/advanced-search - Advanced search`);
    console.log(`   POST /api/messages - Create message`);
    console.log(`   POST /api/messages/read/:id - Read message`);
    console.log(`   GET /api/messages/stats - Enhanced statistics`);
    console.log(`   GET /* - React App (SPA routing)`);
  }, 2000);
});

export default app;
