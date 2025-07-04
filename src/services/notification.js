import Notification from '../DB/models/notification.js';

  export const getNotificationsWithPagination = async (userId, page = 1, limit = 10) => {
    const skip = (page - 1) * limit;
    const notifications = await Notification.find({ user:userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    return notifications;
  }

  export const createNotification = async (user, message) => {
    const notification = new Notification({ user, message });
    await notification.save();
    return notification;
  } 

  export const markNotificationAsRead = async (notificationId) => {
    await Notification.findByIdAndUpdate(notificationId, { read: true });
  }

  export const markAllNotificationsAsRead = async (userId) => {
    await Notification.updateMany({ user:userId, read: false }, { read: true });
  }

  export const deleteNotification = async (notificationId) => {
    await Notification.findByIdAndDelete(notificationId);
  }
  
  export const deleteAllNotifications = async (userId) => {
    await Notification.deleteMany({ user:userId });
  }

  export const getUnreadNotificationCount = async (userId) => {
    const count = await Notification.countDocuments({ user: userId, read: false });
    return count;
  }

  export const getNotificationById = async (notificationId) => {
    const notification = await Notification.findById(notificationId);
    return notification;
  }