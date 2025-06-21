import validator from 'validator';

// Content validation and sanitization
export const validateMessageContent = (req, res, next) => {
  const { senderName, recipientName, message, passwordHint } = req.body;

  const errors = [];

  // Validate sender name
  if (!senderName || typeof senderName !== 'string') {
    errors.push('Sender name is required');
  } else {
    if (senderName.trim().length < 2) {
      errors.push('Sender name must be at least 2 characters long');
    }
    if (senderName.trim().length > 100) {
      errors.push('Sender name must be less than 100 characters');
    }
    if (!validator.isAlphanumeric(senderName.replace(/\s/g, ''), 'en-US', { ignore: ' .-' })) {
      errors.push('Sender name contains invalid characters');
    }
  }

  // Validate recipient name (if provided)
  if (recipientName && typeof recipientName === 'string') {
    if (recipientName.trim().length > 100) {
      errors.push('Recipient name must be less than 100 characters');
    }
  }

  // Validate message content
  if (!message || typeof message !== 'string') {
    errors.push('Message content is required');
  } else {
    if (message.trim().length < 10) {
      errors.push('Message must be at least 10 characters long');
    }
    if (message.trim().length > 10000) {
      errors.push('Message must be less than 10,000 characters');
    }
    
    // Check for potentially harmful content
    const suspiciousPatterns = [
      /<script[\s\S]*?>[\s\S]*?<\/script>/gi,
      /<iframe[\s\S]*?>[\s\S]*?<\/iframe>/gi,
      /javascript:/gi,
      /data:text\/html/gi,
      /vbscript:/gi
    ];
    
    for (const pattern of suspiciousPatterns) {
      if (pattern.test(message)) {
        errors.push('Message contains potentially harmful content');
        break;
      }
    }
  }

  // Validate password hint (if provided)
  if (passwordHint && typeof passwordHint === 'string') {
    if (passwordHint.trim().length > 200) {
      errors.push('Password hint must be less than 200 characters');
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({
      error: 'Validation failed',
      details: errors
    });
  }

  // Sanitize inputs
  req.body.senderName = validator.escape(senderName.trim());
  if (recipientName) {
    req.body.recipientName = validator.escape(recipientName.trim());
  }
  req.body.message = validator.escape(message.trim());
  if (passwordHint) {
    req.body.passwordHint = validator.escape(passwordHint.trim());
  }

  next();
};

// Search query validation
export const validateSearchQuery = (req, res, next) => {
  const { senderName } = req.params;
  const { recipientType, limit, page } = req.query;

  const errors = [];

  // Validate sender name
  if (!senderName || typeof senderName !== 'string') {
    errors.push('Sender name is required');
  } else {
    if (senderName.trim().length < 2) {
      errors.push('Sender name must be at least 2 characters long');
    }
    if (senderName.trim().length > 100) {
      errors.push('Sender name must be less than 100 characters');
    }
  }

  // Validate filters
  if (recipientType && !['person', 'family', 'world', 'all'].includes(recipientType)) {
    errors.push('Invalid recipient type');
  }

  // Validate pagination
  if (limit && (!Number.isInteger(+limit) || +limit < 1 || +limit > 100)) {
    errors.push('Limit must be a number between 1 and 100');
  }

  if (page && (!Number.isInteger(+page) || +page < 1)) {
    errors.push('Page must be a positive integer');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      error: 'Validation failed',
      details: errors
    });
  }

  next();
};

// Password validation for private messages
export const validatePassword = (req, res, next) => {
  const { password } = req.body;

  if (!password || typeof password !== 'string') {
    return res.status(400).json({
      error: 'Password is required'
    });
  }

  if (password.length > 100) {
    return res.status(400).json({
      error: 'Password is too long'
    });
  }

  next();
};

// Spam detection
export const detectSpam = (req, res, next) => {
  const { message, senderName } = req.body;

  const spamIndicators = [
    // Repeated characters
    /(.)\1{10,}/g,
    // All caps with exclamation
    /^[A-Z\s!]{20,}$/g,
    // Common spam phrases
    /free money|click here|urgent|winner|congratulations/gi,
    // Excessive punctuation
    /[!?]{5,}/g,
    // URLs (simple check)
    /http[s]?:\/\/|www\./gi
  ];

  let spamScore = 0;

  for (const pattern of spamIndicators) {
    if (pattern.test(message) || pattern.test(senderName)) {
      spamScore++;
    }
  }

  // Check for very short repetitive messages
  if (message.length < 20 && /^(.{1,5})\1{3,}$/.test(message)) {
    spamScore += 2;
  }

  // If spam score is too high, reject
  if (spamScore >= 3) {
    return res.status(400).json({
      error: 'Message flagged as potential spam',
      message: 'Your message contains content that appears to be spam. Please revise and try again.'
    });
  }

  // Add spam score to request for logging
  req.spamScore = spamScore;

  next();
};
