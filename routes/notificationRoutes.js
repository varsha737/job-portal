import express from 'express';
import userAuth from '../middlewares/authMiddleware.js';
import { 
  createNotification, 
  getUserNotifications, 
  markAsRead,
  updateNotificationPreferences 
} from '../controllers/notificationController.js';

const router = express.Router();

// Routes
router.post('/create', userAuth, createNotification);
router.get('/user-notifications', userAuth, getUserNotifications);
router.patch('/mark-read/:id', userAuth, markAsRead);
router.put('/preferences', userAuth, updateNotificationPreferences);

export default router; 