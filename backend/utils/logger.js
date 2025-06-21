import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure logs directory exists
const logsDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Log levels
const LOG_LEVELS = {
  ERROR: 'ERROR',
  WARN: 'WARN',
  INFO: 'INFO',
  DEBUG: 'DEBUG'
};

// Simple logger function
const writeLog = (level, message, meta = {}) => {
  const timestamp = new Date().toISOString();
  const logEntry = {
    timestamp,
    level,
    message,
    ...meta
  };

  const logString = JSON.stringify(logEntry) + '\n';
  
  // Write to appropriate log file
  const logFile = path.join(logsDir, `${level.toLowerCase()}.log`);
  const allLogsFile = path.join(logsDir, 'all.log');
  
  try {
    fs.appendFileSync(logFile, logString);
    fs.appendFileSync(allLogsFile, logString);
  } catch (error) {
    console.error('Failed to write log:', error);
  }
  
  // Also log to console in development
  if (process.env.NODE_ENV !== 'production') {
    console.log(`[${timestamp}] ${level}: ${message}`, meta);
  }
};

export const logger = {
  error: (message, meta) => writeLog(LOG_LEVELS.ERROR, message, meta),
  warn: (message, meta) => writeLog(LOG_LEVELS.WARN, message, meta),
  info: (message, meta) => writeLog(LOG_LEVELS.INFO, message, meta),
  debug: (message, meta) => writeLog(LOG_LEVELS.DEBUG, message, meta)
};

// Request logging middleware
export const requestLogger = (req, res, next) => {
  const start = Date.now();
  const originalSend = res.send;
  
  // Track response
  res.send = function(data) {
    const duration = Date.now() - start;
    const statusCode = res.statusCode;
    
    logger.info('HTTP Request', {
      method: req.method,
      url: req.originalUrl,
      ip: req.ip || req.connection.remoteAddress,
      userAgent: req.get('User-Agent'),
      statusCode,
      duration: `${duration}ms`,
      contentLength: res.get('Content-Length')
    });
    
    // Log errors and warnings
    if (statusCode >= 500) {
      logger.error('Server Error', {
        method: req.method,
        url: req.originalUrl,
        statusCode,
        duration: `${duration}ms`
      });
    } else if (statusCode >= 400) {
      logger.warn('Client Error', {
        method: req.method,
        url: req.originalUrl,
        statusCode,
        duration: `${duration}ms`
      });
    }
    
    return originalSend.call(this, data);
  };
  
  next();
};

// Error logging
export const logError = (error, req = null) => {
  logger.error('Application Error', {
    message: error.message,
    stack: error.stack,
    url: req?.originalUrl,
    method: req?.method,
    ip: req?.ip,
    timestamp: new Date().toISOString()
  });
};

// Security event logging
export const logSecurityEvent = (event, details) => {
  logger.warn('Security Event', {
    event,
    ...details,
    timestamp: new Date().toISOString()
  });
};

// Performance monitoring
export const logPerformance = (operation, duration, details = {}) => {
  logger.info('Performance', {
    operation,
    duration: `${duration}ms`,
    ...details
  });
};

export default logger;
