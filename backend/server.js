import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import cron from 'node-cron';
import messageRoutes from './routes/messages.js';
import { sendScheduledMessages } from './services/emailService.js';

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

// Routes
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
    cors: 'enabled'
  });
});

// Root endpoint for testing
app.get('/', (req, res) => {
  res.json({ 
    message: 'TellYouSomeday Backend API',
    version: '1.0.0',
    endpoints: ['/api/health', '/api/test', '/api/messages']
  });
});

// Scheduled job to send messages (runs every hour)
cron.schedule('0 * * * *', () => {
  console.log('🕐 Running scheduled message check...');
  sendScheduledMessages();
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`🚀 TellYouSomeday API running on port ${PORT}`);
  console.log(`📱 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🏥 Health check available at: /api/health`);
  console.log(`🌐 CORS enabled for: ${process.env.FRONTEND_URL || 'all origins'}`);
  console.log(`🔗 MongoDB URI: ${process.env.MONGODB_URI ? 'Set' : 'Not set'}`);
  console.log(`🔑 JWT Secret: ${process.env.JWT_SECRET ? 'Set' : 'Not set'}`);
  
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
    console.log(`   GET / - Root endpoint`);
    console.log(`   GET /health - Health check`);
    console.log(`   GET /api/health - Main health check`);
    console.log(`   GET /api/test - Test endpoint`);
    console.log(`   POST /api/messages - Create message`);
    console.log(`   GET /api/messages - Get messages`);
  }, 2000);
});

export default app;
