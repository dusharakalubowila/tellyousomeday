import nodemailer from 'nodemailer';
import Message from '../models/Message.js';

// Email transporter setup
const createTransporter = () => {
  return nodemailer.createTransporter({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
};

// Send scheduled messages
export const sendScheduledMessages = async () => {
  try {
    const scheduledMessages = await Message.getScheduledMessages();
    
    console.log(`📧 Found ${scheduledMessages.length} scheduled messages ready to send`);

    for (const message of scheduledMessages) {
      try {
        // For now, just mark as delivered
        // In a real implementation, you'd send actual emails
        await message.markAsDelivered();
        
        console.log(`✅ Marked message ${message._id} as delivered`);
        
        // TODO: Send actual email notifications
        // await sendEmailNotification(message);
        
      } catch (error) {
        console.error(`❌ Failed to process message ${message._id}:`, error);
      }
    }
    
    return scheduledMessages.length;
  } catch (error) {
    console.error('❌ Error in sendScheduledMessages:', error);
    return 0;
  }
};

// Send email notification (for future implementation)
export const sendEmailNotification = async (message) => {
  try {
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.log('📧 Email service not configured, skipping notification');
      return;
    }

    const transporter = createTransporter();
    
    const mailOptions = {
      from: `"TellYouSomeday" <${process.env.SMTP_USER}>`,
      to: 'recipient@example.com', // This would be dynamically set
      subject: `New message from ${message.senderName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #e74c3c;">You have a new message on TellYouSomeday</h2>
          <p>Someone left a message for you that's now ready to be read.</p>
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>From:</strong> ${message.senderName}</p>
            <p><strong>To:</strong> ${message.recipientName || 'You'}</p>
            <p><strong>Preview:</strong> ${message.message.substring(0, 100)}...</p>
          </div>
          <a href="${process.env.FRONTEND_URL}/search" 
             style="background: #e74c3c; color: white; padding: 12px 24px; 
                    text-decoration: none; border-radius: 6px; display: inline-block;">
            Read Your Message
          </a>
          <p style="margin-top: 30px; color: #666; font-size: 14px;">
            This message was scheduled to be delivered on ${message.deliveryDate.toDateString()}.
          </p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`📧 Email notification sent for message ${message._id}`);
    
  } catch (error) {
    console.error('❌ Failed to send email notification:', error);
  }
};

export default {
  sendScheduledMessages,
  sendEmailNotification
};
