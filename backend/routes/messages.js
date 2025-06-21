import express from 'express';
import Message from '../models/Message.js';
import { 
  createMessageLimiter, 
  searchLimiter, 
  readMessageLimiter 
} from '../middleware/rateLimiter.js';
import { 
  validateMessageContent, 
  validateSearchQuery, 
  validatePassword,
  detectSpam 
} from '../middleware/validation.js';

const router = express.Router();

// Create a new message
router.post('/', createMessageLimiter, validateMessageContent, detectSpam, async (req, res) => {
  try {
    const {
      senderName,
      recipientType,
      recipientName,
      message,
      deliveryType,
      deliveryDate,
      isPrivate,
      passwordHint,
      password
    } = req.body;

    // Validation
    if (!senderName || !message || !recipientType) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['senderName', 'message', 'recipientType']
      });
    }

    if (recipientType === 'person' && !recipientName) {
      return res.status(400).json({
        error: 'Recipient name is required for personal messages'
      });
    }

    if (deliveryType === 'scheduled' && !deliveryDate) {
      return res.status(400).json({
        error: 'Delivery date is required for scheduled messages'
      });
    }

    if (isPrivate && (!passwordHint || !password)) {
      return res.status(400).json({
        error: 'Password hint and password are required for private messages'
      });
    }

    // Create message
    const newMessage = new Message({
      senderName: senderName.trim(),
      recipientType,
      recipientName: recipientName?.trim(),
      message: message.trim(),
      deliveryType: deliveryType || 'immediate',
      deliveryDate: deliveryDate ? new Date(deliveryDate) : undefined,
      isPrivate: Boolean(isPrivate),
      passwordHint: passwordHint?.trim(),
      passwordHash: isPrivate ? password.toLowerCase().trim() : undefined
    });

    const savedMessage = await newMessage.save();

    // Return success response (without sensitive data)
    res.status(201).json({
      success: true,
      message: 'Message saved successfully',
      data: {
        id: savedMessage._id,
        senderName: savedMessage.senderName,
        recipientType: savedMessage.recipientType,
        recipientName: savedMessage.recipientName,
        deliveryType: savedMessage.deliveryType,
        deliveryDate: savedMessage.deliveryDate,
        isPrivate: savedMessage.isPrivate,
        createdAt: savedMessage.createdAt
      }
    });

  } catch (error) {
    console.error('Error creating message:', error);
    res.status(500).json({
      error: 'Failed to save message',
      message: error.message
    });
  }
});

// Enhanced search messages with filters and pagination
router.get('/search/:senderName', searchLimiter, validateSearchQuery, async (req, res) => {
  try {
    const { senderName } = req.params;
    const { 
      recipientType, 
      isPrivate, 
      limit = 20, 
      page = 1, 
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;
    
    if (!senderName || senderName.trim().length < 2) {
      return res.status(400).json({
        error: 'Sender name must be at least 2 characters long'
      });
    }

    // Build search query
    const searchQuery = {
      searchableText: { $regex: senderName.trim().toLowerCase(), $options: 'i' }
    };

    // Add filters
    if (recipientType && recipientType !== 'all') {
      searchQuery.recipientType = recipientType;
    }

    if (isPrivate !== undefined) {
      searchQuery.isPrivate = isPrivate === 'true';
    }

    // Only show messages that are ready to be delivered
    searchQuery.$or = [
      { deliveryType: 'immediate' },
      { 
        deliveryType: 'scheduled',
        deliveryDate: { $lte: new Date() }
      }
    ];

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Execute search with pagination
    const [messages, totalCount] = await Promise.all([
      Message.find(searchQuery)
        .sort(sortOptions)
        .skip(skip)
        .limit(parseInt(limit)),
      Message.countDocuments(searchQuery)
    ]);

    // Filter out sensitive information
    const publicMessages = messages.map(msg => ({
      id: msg._id,
      senderName: msg.senderName,
      recipientType: msg.recipientType,
      recipientName: msg.recipientName,
      previewText: msg.message.substring(0, 150) + (msg.message.length > 150 ? '...' : ''),
      deliveryType: msg.deliveryType,
      deliveryDate: msg.deliveryDate,
      isPrivate: msg.isPrivate,
      passwordHint: msg.passwordHint,
      views: msg.views,
      createdAt: msg.createdAt,
      lastViewedAt: msg.lastViewedAt,
      // Only show full message if not private and delivered
      canRead: !msg.isPrivate && (msg.deliveryType === 'immediate' || 
                (msg.deliveryType === 'scheduled' && new Date() >= msg.deliveryDate))
    }));

    // Calculate pagination info
    const totalPages = Math.ceil(totalCount / parseInt(limit));
    const hasNextPage = parseInt(page) < totalPages;
    const hasPrevPage = parseInt(page) > 1;

    res.json({
      success: true,
      data: {
        messages: publicMessages,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalCount,
          hasNextPage,
          hasPrevPage,
          limit: parseInt(limit)
        },
        filters: {
          senderName: senderName.trim(),
          recipientType: recipientType || 'all',
          isPrivate: isPrivate || 'all'
        }
      }
    });

  } catch (error) {
    console.error('Error searching messages:', error);
    res.status(500).json({
      error: 'Failed to search messages',
      message: error.message
    });
  }
});

// Get a specific message (with password verification if needed)
router.post('/read/:messageId', async (req, res) => {
  try {
    const { messageId } = req.params;
    const { password } = req.body;

    const message = await Message.findById(messageId);
    
    if (!message) {
      return res.status(404).json({
        error: 'Message not found'
      });
    }

    // Check if message is ready to be delivered
    if (message.deliveryType === 'scheduled' && new Date() < message.deliveryDate) {
      return res.status(403).json({
        error: 'Message is not yet available',
        availableAt: message.deliveryDate
      });
    }

    // Check password for private messages
    if (message.isPrivate) {
      if (!password) {
        return res.status(401).json({
          error: 'Password required',
          hint: message.passwordHint
        });
      }

      const isValidPassword = await message.verifyPassword(password);
      if (!isValidPassword) {
        return res.status(401).json({
          error: 'Incorrect password',
          hint: message.passwordHint
        });
      }
    }

    // Increment view count
    await message.incrementView();

    // Mark as delivered if it was scheduled
    if (message.deliveryType === 'scheduled' && !message.isDelivered) {
      await message.markAsDelivered();
    }

    // Return full message
    res.json({
      success: true,
      message: {
        id: message._id,
        senderName: message.senderName,
        recipientType: message.recipientType,
        recipientName: message.recipientName,
        message: message.message,
        deliveryType: message.deliveryType,
        deliveryDate: message.deliveryDate,
        views: message.views,
        createdAt: message.createdAt,
        lastViewedAt: message.lastViewedAt
      }
    });

  } catch (error) {
    console.error('Error reading message:', error);
    res.status(500).json({
      error: 'Failed to read message',
      message: error.message
    });
  }
});

// Enhanced message statistics and analytics
router.get('/stats', async (req, res) => {
  try {
    const { period = '30d' } = req.query;

    // Calculate date range based on period
    const now = new Date();
    let startDate;
    
    switch (period) {
      case '24h':
        startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    // Overall statistics
    const [overallStats] = await Message.aggregate([
      {
        $group: {
          _id: null,
          totalMessages: { $sum: 1 },
          privateMessages: { $sum: { $cond: ['$isPrivate', 1, 0] } },
          publicMessages: { $sum: { $cond: ['$isPrivate', 0, 1] } },
          scheduledMessages: { $sum: { $cond: [{ $eq: ['$deliveryType', 'scheduled'] }, 1, 0] } },
          immediateMessages: { $sum: { $cond: [{ $eq: ['$deliveryType', 'immediate'] }, 1, 0] } },
          deliveredMessages: { $sum: { $cond: ['$isDelivered', 1, 0] } },
          pendingMessages: { $sum: { $cond: ['$isDelivered', 0, 1] } },
          totalViews: { $sum: '$views' },
          averageViews: { $avg: '$views' }
        }
      }
    ]);

    // Period-specific statistics
    const [periodStats] = await Message.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: null,
          newMessages: { $sum: 1 },
          newViews: { $sum: '$views' }
        }
      }
    ]);

    // Recipient type distribution
    const recipientTypeStats = await Message.aggregate([
      {
        $group: {
          _id: '$recipientType',
          count: { $sum: 1 },
          totalViews: { $sum: '$views' },
          averageViews: { $avg: '$views' }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    // Daily message creation over the period
    const dailyStats = await Message.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: { $dayOfMonth: '$createdAt' }
          },
          count: { $sum: 1 },
          views: { $sum: '$views' }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 }
      },
      {
        $project: {
          date: {
            $dateFromParts: {
              year: '$_id.year',
              month: '$_id.month',
              day: '$_id.day'
            }
          },
          count: 1,
          views: 1,
          _id: 0
        }
      }
    ]);

    // Top senders by message count
    const topSenders = await Message.aggregate([
      {
        $group: {
          _id: '$senderName',
          messageCount: { $sum: 1 },
          totalViews: { $sum: '$views' },
          latestMessage: { $max: '$createdAt' }
        }
      },
      {
        $sort: { messageCount: -1 }
      },
      {
        $limit: 10
      },
      {
        $project: {
          senderName: '$_id',
          messageCount: 1,
          totalViews: 1,
          latestMessage: 1,
          _id: 0
        }
      }
    ]);

    // Most viewed messages (public only)
    const topMessages = await Message.aggregate([
      {
        $match: {
          isPrivate: false,
          views: { $gt: 0 }
        }
      },
      {
        $sort: { views: -1 }
      },
      {
        $limit: 5
      },
      {
        $project: {
          id: '$_id',
          senderName: 1,
          recipientType: 1,
          recipientName: 1,
          previewText: { $substr: ['$message', 0, 100] },
          views: 1,
          createdAt: 1,
          _id: 0
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        overview: overallStats || {
          totalMessages: 0,
          privateMessages: 0,
          publicMessages: 0,
          scheduledMessages: 0,
          immediateMessages: 0,
          deliveredMessages: 0,
          pendingMessages: 0,
          totalViews: 0,
          averageViews: 0
        },
        period: {
          range: period,
          startDate,
          endDate: now,
          stats: periodStats || { newMessages: 0, newViews: 0 }
        },
        recipientTypes: recipientTypeStats,
        dailyActivity: dailyStats,
        topSenders,
        topMessages,
        generatedAt: now
      }
    });

  } catch (error) {
    console.error('Error getting enhanced stats:', error);
    res.status(500).json({
      error: 'Failed to get statistics',
      message: error.message
    });
  }
});

// Get trending searches (popular sender names)
router.get('/trending', async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const trending = await Message.aggregate([
      {
        $match: {
          $or: [
            { deliveryType: 'immediate' },
            { 
              deliveryType: 'scheduled',
              deliveryDate: { $lte: new Date() }
            }
          ]
        }
      },
      {
        $group: {
          _id: '$senderName',
          messageCount: { $sum: 1 },
          totalViews: { $sum: '$views' },
          latestMessage: { $max: '$createdAt' },
          recipientTypes: { $addToSet: '$recipientType' }
        }
      },
      {
        $sort: { totalViews: -1, messageCount: -1 }
      },
      {
        $limit: parseInt(limit)
      },
      {
        $project: {
          senderName: '$_id',
          messageCount: 1,
          totalViews: 1,
          latestMessage: 1,
          recipientTypes: 1,
          _id: 0
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        trending,
        generatedAt: new Date()
      }
    });

  } catch (error) {
    console.error('Error getting trending searches:', error);
    res.status(500).json({
      error: 'Failed to get trending searches',
      message: error.message
    });
  }
});

// Advanced search with multiple criteria
router.post('/advanced-search', async (req, res) => {
  try {
    const { 
      senderName,
      recipientName,
      recipientType,
      isPrivate,
      deliveryType,
      dateRange,
      messageContent,
      limit = 20,
      page = 1,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.body;

    // Build complex search query
    const searchQuery = {};
    
    // Only show messages that are ready to be delivered
    searchQuery.$or = [
      { deliveryType: 'immediate' },
      { 
        deliveryType: 'scheduled',
        deliveryDate: { $lte: new Date() }
      }
    ];

    if (senderName) {
      searchQuery.searchableText = { 
        $regex: senderName.trim().toLowerCase(), 
        $options: 'i' 
      };
    }

    if (recipientName) {
      searchQuery.recipientName = { 
        $regex: recipientName.trim(), 
        $options: 'i' 
      };
    }

    if (recipientType && recipientType !== 'all') {
      searchQuery.recipientType = recipientType;
    }

    if (isPrivate !== undefined) {
      searchQuery.isPrivate = isPrivate;
    }

    if (deliveryType && deliveryType !== 'all') {
      searchQuery.deliveryType = deliveryType;
    }

    if (dateRange) {
      const dateQuery = {};
      if (dateRange.start) {
        dateQuery.$gte = new Date(dateRange.start);
      }
      if (dateRange.end) {
        dateQuery.$lte = new Date(dateRange.end);
      }
      if (Object.keys(dateQuery).length > 0) {
        searchQuery.createdAt = dateQuery;
      }
    }

    if (messageContent) {
      searchQuery.message = { 
        $regex: messageContent.trim(), 
        $options: 'i' 
      };
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Execute search
    const [messages, totalCount] = await Promise.all([
      Message.find(searchQuery)
        .sort(sortOptions)
        .skip(skip)
        .limit(parseInt(limit)),
      Message.countDocuments(searchQuery)
    ]);

    // Filter sensitive information
    const publicMessages = messages.map(msg => ({
      id: msg._id,
      senderName: msg.senderName,
      recipientType: msg.recipientType,
      recipientName: msg.recipientName,
      previewText: msg.message.substring(0, 150) + (msg.message.length > 150 ? '...' : ''),
      deliveryType: msg.deliveryType,
      deliveryDate: msg.deliveryDate,
      isPrivate: msg.isPrivate,
      passwordHint: msg.passwordHint,
      views: msg.views,
      createdAt: msg.createdAt,
      lastViewedAt: msg.lastViewedAt,
      canRead: !msg.isPrivate
    }));

    // Pagination info
    const totalPages = Math.ceil(totalCount / parseInt(limit));

    res.json({
      success: true,
      data: {
        messages: publicMessages,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalCount,
          hasNextPage: parseInt(page) < totalPages,
          hasPrevPage: parseInt(page) > 1,
          limit: parseInt(limit)
        },
        searchCriteria: req.body
      }
    });

  } catch (error) {
    console.error('Error in advanced search:', error);
    res.status(500).json({
      error: 'Failed to perform advanced search',
      message: error.message
    });
  }
});

export default router;
