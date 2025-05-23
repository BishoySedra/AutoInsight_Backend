import { Router } from "express";
import * as notificationController from "../controllers/notification.js";
import authorize from "../middlewares/authorization/authorize.js";

const router = Router();

/**
 * @swagger
 * /notifications:
 *   get:
 *     summary: Get notifications with pagination
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved notifications
 *         content:
 *           application/json:
 *             example:
 *               message: "Successfully retrieved notifications"
 *               body:
 *                 notifications:
 *                   - id: "1"
 *                     message: "New comment on your post"
 *                   - id: "2"
 *                     message: "Your profile was updated"
 *               status: 200
 */
// Endpoint to get notifications by pagination
router.get("/", authorize, notificationController.getNotificationsByPagination);

/**
 * @swagger
 * /notifications/unread/count:
 *   get:
 *     summary: Get unread notification count
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved unread notification count
 *         content:
 *           application/json:
 *             example:
 *               message: "Successfully retrieved unread notification count"
 *               body:
 *                 unreadCount: 5
 *               status: 200
 */
// Endpoint to get unread notification count
router.get("/unread/count", authorize, notificationController.getUnreadNotificationCount);

/**
 * @swagger
 * /notifications:
 *   post:
 *     summary: Add a new notification
 *     tags: [Notifications]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 example: "You have a new follower"
 *     responses:
 *       201:
 *         description: Successfully added notification
 *         content:
 *           application/json:
 *             example:
 *               message: "Notification added successfully"
 *               body:
 *                 id: "12345"
 *                 message: "You have a new follower"
 *               status: 201
 */
// Endpoint to add notification
router.post("/", authorize, notificationController.createNotification);

/**
 * @swagger
 * /notifications/{notificationId}/read:
 *   put:
 *     summary: Mark a notification as read
 *     tags: [Notifications]
 *     parameters:
 *       - in: path
 *         name: notificationId
 *         required: true
 *         schema:
 *           type: string
 *         description: Notification ID
 *     responses:
 *       200:
 *         description: Successfully marked notification as read
 *         content:
 *           application/json:
 *             example:
 *               message: "Notification marked as read"
 *               body: {}
 *               status: 200
 */
// Endpoint to mark notification as read
router.put("/:notificationId/read", authorize, notificationController.markNotificationAsRead);

/**
 * @swagger
 * /notifications/read:
 *   put:
 *     summary: Mark all notifications as read
 *     tags: [Notifications]
 *     responses:
 *       200:
 *         description: Successfully marked all notifications as read
 *         content:
 *           application/json:
 *             example:
 *               message: "All notifications marked as read"
 *               body: {}
 *               status: 200
 */
// Endpoint to mark all notifications as read
router.put("/read", authorize, notificationController.markAllNotificationsAsRead);

/**
 * @swagger
 * /notifications/{notificationId}:
 *   delete:
 *     summary: Delete a notification by ID
 *     tags: [Notifications]
 *     parameters:
 *       - in: path
 *         name: notificationId
 *         required: true
 *         schema:
 *           type: string
 *         description: Notification ID
 *     responses:
 *       200:
 *         description: Successfully deleted notification
 *         content:
 *           application/json:
 *             example:
 *               message: "Notification deleted successfully"
 *               body: {}
 *               status: 200
 */
// Endpoint to delete notification
router.delete("/:notificationId", authorize, notificationController.deleteNotification);

/**
 * @swagger
 * /notifications:
 *   delete:
 *     summary: Delete all notifications
 *     tags: [Notifications]
 *     responses:
 *       200:
 *         description: Successfully deleted all notifications
 *         content:
 *           application/json:
 *             example:
 *               message: "All notifications deleted successfully"
 *               body: {}
 *               status: 200
 */
// Endpoint to delete all notifications
router.delete("/", authorize, notificationController.deleteAllNotifications);

export default router;