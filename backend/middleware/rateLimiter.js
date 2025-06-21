import rateLimit from 'express-rate-limit';

// Rate limiting for message creation
export const createMessageLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 message creations per windowMs
  message: {
    error: 'Too many messages created from this IP',
    message: 'Please wait before creating another message',
    retryAfter: '15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      error: 'Rate limit exceeded',
      message: 'Too many messages created. Please wait 15 minutes before trying again.',
      retryAfter: new Date(Date.now() + 15 * 60 * 1000)
    });
  }
});

// Rate limiting for search requests
export const searchLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 30, // Limit each IP to 30 search requests per minute
  message: {
    error: 'Too many search requests',
    message: 'Please slow down your search requests'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Rate limiting for message reading
export const readMessageLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 20, // Limit each IP to 20 read requests per minute
  message: {
    error: 'Too many read requests',
    message: 'Please slow down your message reading'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// General API rate limiter
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests',
    message: 'Too many requests from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false
});
