import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const messageSchema = new mongoose.Schema({
  // Sender Information
  senderName: {
    type: String,
    required: true,
    trim: true,
    maxLength: 100
  },
  
  // Recipient Information  
  recipientType: {
    type: String,
    required: true,
    enum: ['person', 'family', 'world']
  },
  recipientName: {
    type: String,
    trim: true,
    maxLength: 100,
    required: function() {
      return this.recipientType === 'person';
    }
  },
  
  // Message Content
  message: {
    type: String,
    required: true,
    maxLength: 10000 // 10k characters max
  },
  
  // Delivery Settings
  deliveryType: {
    type: String,
    required: true,
    enum: ['immediate', 'scheduled'],
    default: 'immediate'
  },
  deliveryDate: {
    type: Date,
    required: function() {
      return this.deliveryType === 'scheduled';
    }
  },
  
  // Privacy & Security
  isPrivate: {
    type: Boolean,
    default: false
  },
  passwordHint: {
    type: String,
    trim: true,
    maxLength: 200,
    required: function() {
      return this.isPrivate;
    }
  },
  passwordHash: {
    type: String,
    required: function() {
      return this.isPrivate;
    }
  },
  
  // Status & Metadata
  isDelivered: {
    type: Boolean,
    default: false
  },
  deliveredAt: {
    type: Date
  },
  views: {
    type: Number,
    default: 0
  },
  lastViewedAt: {
    type: Date
  },
    // Search & Discovery
  searchableText: {
    type: String // Lowercase version for search
  },
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Pre-save middleware
messageSchema.pre('save', async function(next) {
  this.updatedAt = new Date();
  
  // Create searchable text (lowercase sender name for search)
  this.searchableText = this.senderName.toLowerCase();
  
  // Hash password if provided
  if (this.isPrivate && this.isModified('passwordHash') && !this.passwordHash.startsWith('$2a$')) {
    this.passwordHash = await bcrypt.hash(this.passwordHash, 12);
  }
  
  next();
});

// Methods
messageSchema.methods.verifyPassword = async function(password) {
  if (!this.isPrivate || !this.passwordHash) return false;
  return await bcrypt.compare(password.toLowerCase().trim(), this.passwordHash);
};

messageSchema.methods.incrementView = function() {
  this.views += 1;
  this.lastViewedAt = new Date();
  return this.save();
};

messageSchema.methods.markAsDelivered = function() {
  this.isDelivered = true;
  this.deliveredAt = new Date();
  return this.save();
};

// Static methods
messageSchema.statics.searchBySender = function(senderName) {
  return this.find({
    searchableText: { $regex: senderName.toLowerCase(), $options: 'i' }
  }).sort({ createdAt: -1 });
};

messageSchema.statics.getScheduledMessages = function() {
  return this.find({
    deliveryType: 'scheduled',
    isDelivered: false,
    deliveryDate: { $lte: new Date() }
  });
};

// Indexes for performance
messageSchema.index({ senderName: 1 });
messageSchema.index({ searchableText: 1 });
messageSchema.index({ deliveryDate: 1, isDelivered: 1 });
messageSchema.index({ createdAt: -1 });

const Message = mongoose.model('Message', messageSchema);

export default Message;
