import * as notificationService from "../services/notification.js";
import { wrapper } from "../utils/wrapper.js";
import { sendResponse } from "../utils/response.js";

export const getNotificationsByPagination = async (req, res, next) => {
    wrapper(async (req, res, next) => {
        const { page, limit } = req.query;
        const userId = req.userId; // Assuming userId is available in req.userId
        const notifications = await notificationService.getNotificationsWithPagination(userId, page, limit);
        return sendResponse(res, notifications, "Notifications fetched successfully", 200);
    })(req, res, next);
};

export const createNotification = async (req, res, next) => {
    wrapper(async (req, res, next) => {
        const { message } = req.body;
        const userId = req.userId; // Assuming userId is available in req.userId
        const notification = await notificationService.createNotification(userId, message);
        return sendResponse(res, notification, "Notification created successfully", 201);
    })(req, res, next);
};

export const markNotificationAsRead = async (req, res, next) => {
    wrapper(async (req, res, next) => {
        const { notificationId } = req.params;
        await notificationService.markNotificationAsRead(notificationId);
        return sendResponse(res, null, "Notification marked as read successfully", 200);
    })(req, res, next);
};

export const deleteNotification = async (req, res, next) => {
    wrapper(async (req, res, next) => {
        const { notificationId } = req.params;
        await notificationService.deleteNotification(notificationId);
        return sendResponse(res, null, "Notification deleted successfully", 200);
    })(req, res, next);
};

export const getNotificationById = async (req, res, next) => {

    wrapper(async (req, res, next) => {
        const { notificationId } = req.params;
        const notification = await notificationService.getNotificationById(notificationId);
        return sendResponse(res, notification, "Notification fetched successfully", 200);
    })(req, res, next);
}

export const markAllNotificationsAsRead = async (req, res, next) => {
    wrapper(async (req, res, next) => {
        const userId = req.userId; // Assuming userId is available in req.userId
        await notificationService.markAllNotificationsAsRead(userId);
        return sendResponse(res, null, "All notifications marked as read successfully", 200);
    })(req, res, next);
};

export const deleteAllNotifications = async (req, res, next) => {
    wrapper(async (req, res, next) => {
        const userId = req.userId; // Assuming userId is available in req.userId
        await notificationService.deleteAllNotifications(userId);
        return sendResponse(res, null, "All notifications deleted successfully", 200);
    })(req, res, next);
};

export const getUnreadNotificationCount = async (req, res, next) => {
    wrapper(async (req, res, next) => {
        const userId = req.userId; // Assuming userId is available in req.userId
        const count = await notificationService.getUnreadNotificationCount(userId);
        return sendResponse(res, { count }, "Unread notification count fetched successfully", 200);
    })(req, res, next);
};
