import { Router } from "express";
import * as notificationController from "../controllers/notification.js";
import authorize from "../middlewares/authorization/authorize.js";

const router = Router();

/**
 * @swagger
 * /notifications:
 *   get:
 *     summary: Retrieve a paginated list of notifications for the authenticated user
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 10
 *         description: Number of notifications per page
 *     responses:
 *       200:
 *         description: Successfully retrieved notifications
 *         content:
 *           application/json:
 *             example:
 *               message: "Notifications fetched successfully"
 *               body:
 *                 notifications:
 *                   - id: "1"
 *                     message: "New comment on your post"
 *                     read: false
 *                     createdAt: "2023-03-01T12:00:00Z"
 *                   - id: "2"
 *                     message: "Your profile was updated"
 *                     read: true
 *                     createdAt: "2023-02-28T15:30:00Z"
 *               status: 200
 */
router.get("/", authorize, notificationController.getNotificationsByPagination);

/**
 * @swagger
 * /notifications/unread/count:
 *   get:
 *     summary: Retrieve the count of unread notifications for the authenticated user
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved unread notification count
 *         content:
 *           application/json:
 *             example:
 *               message: "Unread notification count fetched successfully"
 *               body:
 *                 count: 5
 *               status: 200
 */
router.get("/unread/count", authorize, notificationController.getUnreadNotificationCount);

/**
 * @swagger
 * /notifications:
 *   post:
 *     summary: Create a new notification for the authenticated user
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
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
 *         description: Successfully created notification
 *         content:
 *           application/json:
 *             example:
 *               message: "Notification created successfully"
 *               body:
 *                 id: "12345"
 *                 message: "You have a new follower"
 *                 read: false
 *                 createdAt: "2023-03-01T12:00:00Z"
 *               status: 201
 */
router.post("/", authorize, notificationController.createNotification);

/**
 * @swagger
 * /notifications/{notificationId}/read:
 *   put:
 *     summary: Mark a specific notification as read
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: notificationId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the notification to mark as read
 *     responses:
 *       200:
 *         description: Successfully marked notification as read
 *         content:
 *           application/json:
 *             example:
 *               message: "Notification marked as read successfully"
 *               body: {}
 *               status: 200
 */
router.put("/:notificationId/read", authorize, notificationController.markNotificationAsRead);

/**
 * @swagger
 * /notifications/read:
 *   put:
 *     summary: Mark all notifications as read for the authenticated user
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully marked all notifications as read
 *         content:
 *           application/json:
 *             example:
 *               message: "All notifications marked as read successfully"
 *               body: {}
 *               status: 200
 */
router.put("/read", authorize, notificationController.markAllNotificationsAsRead);

/**
 * @swagger
 * /notifications/{notificationId}:
 *   delete:
 *     summary: Delete a specific notification by ID
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: notificationId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the notification to delete
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
router.delete("/:notificationId", authorize, notificationController.deleteNotification);

/**
 * @swagger
 * /notifications:
 *   delete:
 *     summary: Delete all notifications for the authenticated user
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
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
router.delete("/", authorize, notificationController.deleteAllNotifications);

export default router;