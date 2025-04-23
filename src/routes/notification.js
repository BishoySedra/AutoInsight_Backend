import { Router } from "express";
import * as notificationController from "../controllers/notification.js";
import authorize from "../middlewares/authorization/authorize.js"

const router = Router();

// Endpoint to get notifications by pagination
router.get("/", authorize, notificationController.getNotificationsByPagination);

// Endpoint to get unread notification count
router.get("/unread/count", authorize, notificationController.getUnreadNotificationCount);

// Endpoint to add notification
router.post("/", authorize, notificationController.createNotification);

// Endpoint to mark notification as read
router.put("/:notificationId/read", authorize, notificationController.markNotificationAsRead);

// Endpoint to mark all notifications as read
router.put("/read", authorize, notificationController.markAllNotificationsAsRead);

// Endpoint to delete notification
router.delete("/:notificationId", authorize, notificationController.deleteNotification);

// Endpoint to delete all notifications
router.delete("/", authorize, notificationController.deleteAllNotifications);


export default router;