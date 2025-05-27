import nodemailer from 'nodemailer';
import twilio from 'twilio';
import Notification from '../models/notificationModel.js';
import User from '../models/userModel.js';

// Configure nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Configure Twilio
const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// Create notification
export const createNotification = async (req, res, next) => {
  try {
    const notification = await Notification.create(req.body);
    await sendNotification(notification);
    res.status(201).json({ notification });
  } catch (error) {
    next(error);
  }
};

// Get user notifications
export const getUserNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find({ 
      recipient: req.user.userId,
      read: false 
    })
    .sort('-createdAt')
    .limit(10);

    res.status(200).json({ notifications });
  } catch (error) {
    next(error);
  }
};

// Mark notification as read
export const markAsRead = async (req, res, next) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );
    res.status(200).json({ notification });
  } catch (error) {
    next(error);
  }
};

// Update notification preferences
export const updateNotificationPreferences = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { 
        'notificationPreferences': req.body 
      },
      { new: true }
    );
    res.status(200).json({ 
      message: 'Notification preferences updated',
      preferences: user.notificationPreferences 
    });
  } catch (error) {
    next(error);
  }
};

// Helper function to send notifications
const sendNotification = async (notification) => {
  try {
    const user = await User.findById(notification.recipient);
    const prefs = user.notificationPreferences;

    // Send Email
    if (prefs.email.enabled && notification.type !== 'whatsapp') {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: prefs.email.address || user.email,
        subject: notification.title,
        text: notification.message,
        html: `<div style="padding: 20px; background-color: #f5f5f5;">
                <h2>${notification.title}</h2>
                <p>${notification.message}</p>
                ${notification.jobId ? 
                  `<a href="${process.env.FRONTEND_URL}/jobs/${notification.jobId}" 
                    style="padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">
                    View Job
                   </a>` 
                  : ''
                }
              </div>`
      });
    }

    // Send WhatsApp
    if (prefs.whatsapp.enabled && notification.type !== 'email' && prefs.whatsapp.number) {
      await twilioClient.messages.create({
        body: `${notification.title}\n\n${notification.message}`,
        from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
        to: `whatsapp:${prefs.whatsapp.number}`
      });
    }

    // Update notification status
    await Notification.findByIdAndUpdate(notification._id, { status: 'sent' });

  } catch (error) {
    console.error('Error sending notification:', error);
    await Notification.findByIdAndUpdate(notification._id, { status: 'failed' });
  }
}; 