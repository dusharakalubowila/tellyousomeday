import express from 'express';
import Message from '../models/Message.js';

const router = express.Router();

// Create a new message
router.post('/', async (req, res) => {
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

// Search messages by sender name
router.get('/search/:senderName', async (req, res) => {
  try {
    const { senderName } = req.params;
    
    if (!senderName || senderName.trim().length < 2) {
      return res.status(400).json({
        error: 'Sender name must be at least 2 characters long'
      });
    }

    const messages = await Message.searchBySender(senderName.trim());

    // Filter out sensitive information
    const publicMessages = messages.map(msg => ({
      id: msg._id,
      senderName: msg.senderName,
      recipientType: msg.recipientType,
      recipientName: msg.recipientName,
      previewText: msg.message.substring(0, 100) + (msg.message.length > 100 ? '...' : ''),
      deliveryType: msg.deliveryType,
      deliveryDate: msg.deliveryDate,
      isPrivate: msg.isPrivate,
      passwordHint: msg.passwordHint,
      views: msg.views,
      createdAt: msg.createdAt,
      // Only show full message if not private and delivered (or immediate)
      canRead: !msg.isPrivate && (msg.deliveryType === 'immediate' || 
                (msg.deliveryType === 'scheduled' && new Date() >= msg.deliveryDate))
    }));

    res.json({
      success: true,
      count: publicMessages.length,
      messages: publicMessages
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

// Get message statistics (for admin/analytics)
router.get('/stats', async (req, res) => {
  try {
    const stats = await Message.aggregate([
      {
        $group: {
          _id: null,
          totalMessages: { $sum: 1 },
          privateMessages: { $sum: { $cond: ['$isPrivate', 1, 0] } },
          scheduledMessages: { $sum: { $cond: [{ $eq: ['$deliveryType', 'scheduled'] }, 1, 0] } },
          deliveredMessages: { $sum: { $cond: ['$isDelivered', 1, 0] } },
          totalViews: { $sum: '$views' }
        }
      }
    ]);

    const recipientTypeStats = await Message.aggregate([
      {
        $group: {
          _id: '$recipientType',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      success: true,
      stats: stats[0] || {
        totalMessages: 0,
        privateMessages: 0,
        scheduledMessages: 0,
        deliveredMessages: 0,
        totalViews: 0
      },
      recipientTypeStats
    });

  } catch (error) {
    console.error('Error getting stats:', error);
    res.status(500).json({
      error: 'Failed to get statistics',
      message: error.message
    });
  }
});

export default router;
