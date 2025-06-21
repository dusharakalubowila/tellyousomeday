import nodemailer from 'nodemailer';
import Message from '../models/Message.js';
import { logger } from '../utils/logger.js';

// Email transporter setup
const createTransporter = () => {
  const config = {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  };

  logger.info('Creating email transporter', { 
    host: config.host, 
    port: config.port,
    user: config.auth.user ? 'configured' : 'not configured'
  });

  return nodemailer.createTransporter(config);
};

// Email templates
const emailTemplates = {
  messageNotification: (message) => ({
    subject: `💌 New message from ${message.senderName} - TellYouSomeday`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Message - TellYouSomeday</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4; }
          .container { max-width: 600px; margin: 0 auto; background-color: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; }
          .content { padding: 30px; }
          .message-preview { background: #f8f9fa; border-left: 4px solid #e74c3c; padding: 20px; margin: 20px 0; border-radius: 8px; }
          .button { display: inline-block; background: linear-gradient(45deg, #e74c3c, #f39c12); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: 600; margin: 20px 0; }
          .footer { background: #f8f9fa; padding: 20px; text-align: center; color: #6c757d; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>💌 TellYouSomeday</h1>
            <p>Someone left you a special message</p>
          </div>
          <div class="content">
            <h2>Hello ${message.recipientName || 'there'}!</h2>
            <p>You have received a new message that's now ready to be read.</p>
            
            <div class="message-preview">
              <p><strong>From:</strong> ${message.senderName}</p>
              <p><strong>To:</strong> ${message.recipientName || 'You'}</p>
              <p><strong>Type:</strong> ${message.recipientType === 'person' ? 'Personal Message' : message.recipientType === 'family' ? 'Family Message' : 'Public Message'}</p>
              <p><strong>Preview:</strong></p>
              <em>"${message.message.substring(0, 150)}${message.message.length > 150 ? '...' : ''}"</em>
            </div>
            
            <p>This message ${message.deliveryType === 'scheduled' ? `was scheduled to be delivered on ${new Date(message.deliveryDate).toDateString()}` : 'is available to read now'}.</p>
            
            <div style="text-align: center;">
              <a href="${process.env.FRONTEND_URL || 'https://tellyousomeday.com'}/search" class="button">
                Read Your Message 📖
              </a>
            </div>
            
            <p>Search for "<strong>${message.senderName}</strong>" on TellYouSomeday to find and read your message.</p>
          </div>
          <div class="footer">
            <p>© 2024 TellYouSomeday. Made with ❤️ for connecting hearts across time.</p>
            <p>This is an automated message. Please do not reply to this email.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
      TellYouSomeday - New Message
      
      Hello ${message.recipientName || 'there'}!
      
      You have received a new message from ${message.senderName}.
      
      Preview: "${message.message.substring(0, 150)}${message.message.length > 150 ? '...' : ''}"
      
      Visit ${process.env.FRONTEND_URL || 'https://tellyousomeday.com'}/search and search for "${message.senderName}" to read your full message.
      
      This message ${message.deliveryType === 'scheduled' ? `was scheduled to be delivered on ${new Date(message.deliveryDate).toDateString()}` : 'is available to read now'}.
      
      © 2024 TellYouSomeday
    `
  }),

  weeklyDigest: (messages) => ({
    subject: `📬 Your Weekly TellYouSomeday Digest - ${messages.length} messages waiting`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Weekly Digest - TellYouSomeday</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4; }
          .container { max-width: 600px; margin: 0 auto; background-color: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; }
          .content { padding: 30px; }
          .message-item { background: #f8f9fa; border-radius: 8px; padding: 15px; margin: 15px 0; border-left: 4px solid #e74c3c; }
          .button { display: inline-block; background: linear-gradient(45deg, #e74c3c, #f39c12); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: 600; margin: 20px 0; }
          .footer { background: #f8f9fa; padding: 20px; text-align: center; color: #6c757d; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📬 Weekly Digest</h1>
            <p>Messages waiting for you on TellYouSomeday</p>
          </div>
          <div class="content">
            <h2>Hello!</h2>
            <p>Here's your weekly summary of messages that might be waiting for you:</p>
            
            ${messages.slice(0, 5).map(msg => `
              <div class="message-item">
                <strong>From: ${msg.senderName}</strong><br>
                <em>"${msg.message.substring(0, 100)}..."</em>
              </div>
            `).join('')}
            
            ${messages.length > 5 ? `<p>...and ${messages.length - 5} more messages!</p>` : ''}
            
            <div style="text-align: center;">
              <a href="${process.env.FRONTEND_URL || 'https://tellyousomeday.com'}/search" class="button">
                Explore Messages 🔍
              </a>
            </div>
          </div>
          <div class="footer">
            <p>© 2024 TellYouSomeday. Connecting hearts across time.</p>
            <p>You're receiving this because you've searched for messages on TellYouSomeday.</p>
          </div>
        </div>
      </body>
      </html>
    `
  })
};

// Send scheduled messages with enhanced tracking
export const sendScheduledMessages = async () => {
  const startTime = Date.now();
  
  try {
    const scheduledMessages = await Message.getScheduledMessages();
    
    logger.info('Processing scheduled messages', { 
      count: scheduledMessages.length 
    });

    let processedCount = 0;
    let errorCount = 0;

    for (const message of scheduledMessages) {
      try {
        // Mark as delivered first
        await message.markAsDelivered();
        processedCount++;
        
        logger.info('Message marked as delivered', { 
          messageId: message._id,
          senderName: message.senderName,
          recipientType: message.recipientType
        });
        
        // Send email notification if enabled and recipient info is available
        if (process.env.ENABLE_EMAIL_NOTIFICATIONS === 'true' && message.recipientType === 'person') {
          try {
            await sendEmailNotification(message);
          } catch (emailError) {
            logger.error('Failed to send email notification', {
              messageId: message._id,
              error: emailError.message
            });
            // Don't count this as a failure for message processing
          }
        }
        
      } catch (error) {
        errorCount++;
        logger.error('Failed to process scheduled message', {
          messageId: message._id,
          error: error.message,
          stack: error.stack
        });
      }
    }
    
    const duration = Date.now() - startTime;
    logger.info('Scheduled messages processing completed', {
      total: scheduledMessages.length,
      processed: processedCount,
      errors: errorCount,
      duration: `${duration}ms`
    });
    
    return { processed: processedCount, errors: errorCount, total: scheduledMessages.length };
    
  } catch (error) {
    const duration = Date.now() - startTime;
    logger.error('Error in sendScheduledMessages', {
      error: error.message,
      stack: error.stack,
      duration: `${duration}ms`
    });
    return { processed: 0, errors: 1, total: 0 };
  }
};

// Enhanced email notification with better error handling
export const sendEmailNotification = async (message) => {
  try {
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      logger.warn('Email service not configured, skipping notification', {
        messageId: message._id
      });
      return;
    }

    const transporter = createTransporter();
    const template = emailTemplates.messageNotification(message);
    
    // For now, we'll use a placeholder email since we don't have real recipient emails
    // In a real implementation, you'd have user accounts with email addresses
    const recipientEmail = process.env.TEST_RECIPIENT_EMAIL || 'recipient@example.com';
    
    const mailOptions = {
      from: `"TellYouSomeday 💌" <${process.env.SMTP_USER}>`,
      to: recipientEmail,
      subject: template.subject,
      html: template.html,
      text: template.text
    };

    const info = await transporter.sendMail(mailOptions);
    
    logger.info('Email notification sent successfully', {
      messageId: message._id,
      recipientEmail,
      messageId: info.messageId,
      response: info.response
    });
    
    return info;
    
  } catch (error) {
    logger.error('Failed to send email notification', {
      messageId: message._id,
      error: error.message,
      stack: error.stack
    });
    throw error;
  }
};

// Test email configuration
export const testEmailConfig = async () => {
  try {
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      return { success: false, message: 'Email configuration not found' };
    }

    const transporter = createTransporter();
    await transporter.verify();
    
    logger.info('Email configuration test passed');
    return { success: true, message: 'Email configuration is valid' };
    
  } catch (error) {
    logger.error('Email configuration test failed', {
      error: error.message
    });
    return { success: false, message: error.message };
  }
};

export default {
  sendScheduledMessages,
  sendEmailNotification,
  testEmailConfig
};
