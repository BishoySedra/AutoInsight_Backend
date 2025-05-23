import { Router } from "express";
import * as userController from "../controllers/user.js";
import authorize from "../middlewares/authorization/authorize.js";
import authorizeAdmin from "../middlewares/authorization/authorizeAdmin.js";
import uploadFile from "../middlewares/upload/file.js"

const router = Router();

/**
 * @swagger
 * /users/jobs-count:
 *   get:
 *     summary: Get job counts
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved job counts
 *         content:
 *           application/json:
 *             example:
 *               message: "Successfully retrieved job counts"
 *               body:
 *                 totalJobs: 42
 *               status: 200
 */
// endpoint to get jobs counts
router.get("/jobs-count", authorizeAdmin, userController.getJobsCounts);

/**
 * @swagger
 * /users/users-months:
 *   get:
 *     summary: Get number of users by month
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved user data
 *         content:
 *           application/json:
 *             example:
 *               message: "Successfully retrieved user data"
 *               body:
 *                 January: 10
 *                 February: 15
 *               status: 200
 */
// endpoint to get jobs counts
router.get("/users-months", authorizeAdmin, userController.getNumberOfUsersByMonth);

/**
 * @swagger
 * /users/country-count:
 *   get:
 *     summary: Get country counts
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved country counts
 *         content:
 *           application/json:
 *             example:
 *               message: "Successfully retrieved country counts"
 *               body:
 *                 USA: 20
 *                 Canada: 10
 *               status: 200
 */
// endpoint to get countries counts
router.get("/country-count", authorizeAdmin, userController.getCountryCounts);

/**
 * @swagger
 * /users/user-id:
 *   get:
 *     summary: Get user ID by username or email
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: username
 *         schema:
 *           type: string
 *         description: Username of the user
 *       - in: query
 *         name: email
 *         schema:
 *           type: string
 *         description: Email of the user
 *     responses:
 *       200:
 *         description: Successfully retrieved user ID
 *         content:
 *           application/json:
 *             example:
 *               message: "Successfully retrieved user ID"
 *               body:
 *                 userId: "12345"
 *               status: 200
 */
// endpoint to get user id by username or email
router.get("/user-id", authorize, userController.getUserId);

/**
 * @swagger
 * /users/user-data:
 *   get:
 *     summary: Get user details
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved user details
 *         content:
 *           application/json:
 *             example:
 *               message: "Successfully retrieved user details"
 *               body:
 *                 id: "12345"
 *                 name: "John Doe"
 *                 email: "john.doe@example.com"
 *               status: 200
 */
// endpoint to return user data
router.get("/user-data", authorize, userController.getUserDetails);

/**
 * @swagger
 * /users/users-no:
 *   get:
 *     summary: Get total number of users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Successfully retrieved user count
 *         content:
 *           application/json:
 *             example:
 *               message: "Successfully retrieved user count"
 *               body:
 *                 totalUsers: 100
 *               status: 200
 */
// endpoint to return users numbers
router.get("/users-no", authorize, userController.getNumberOfUsers);

/**
 * @swagger
 * /users/search:
 *   get:
 *     summary: Search users
 *     tags: [Users]
 *     parameters:
 *       - in: query
 *         name: query
 *         schema:
 *           type: string
 *         description: Search query
 *     responses:
 *       200:
 *         description: Successfully retrieved search results
 *         content:
 *           application/json:
 *             example:
 *               message: "Successfully retrieved search results"
 *               body:
 *                 users:
 *                   - id: "12345"
 *                     name: "John Doe"
 *                   - id: "67890"
 *                     name: "Jane Smith"
 *               status: 200
 */
// endpoint to search users
router.get('/search', userController.searchUsers);

/**
 * @swagger
 * /users/recent-4-users:
 *   get:
 *     summary: Get the 4 most recent users
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved recent users
 *         content:
 *           application/json:
 *             example:
 *               message: "Successfully retrieved recent users"
 *               body:
 *                 users:
 *                   - id: "12345"
 *                     name: "John Doe"
 *                   - id: "67890"
 *                     name: "Jane Smith"
 *               status: 200
 */
// endpoint to get recent users
router.get('/recent-4-users', authorizeAdmin, userController.getRecentUsers);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get user data by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: Successfully retrieved user data
 *         content:
 *           application/json:
 *             example:
 *               message: "Successfully retrieved user data"
 *               body:
 *                 id: "12345"
 *                 name: "John Doe"
 *                 email: "john.doe@example.com"
 *               status: 200
 */
// endpoint to get user data by id
router.get('/:id', authorize, userController.getUserDataById);

/**
 * @swagger
 * /users/profile-picture:
 *   put:
 *     summary: Update profile picture
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Successfully updated profile picture
 *         content:
 *           application/json:
 *             example:
 *               message: "Profile picture updated successfully"
 *               body:
 *                 url: "https://example.com/profile-picture.jpg"
 *               status: 200
 */
// endpoint to update profile picture
router.put("/profile-picture", authorize, uploadFile, userController.updateProfilePicture);

/**
 * @swagger
 * /users/update-job:
 *   patch:
 *     summary: Update user job
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               jobTitle:
 *                 type: string
 *                 example: "Software Engineer"
 *     responses:
 *       200:
 *         description: Successfully updated user job
 *         content:
 *           application/json:
 *             example:
 *               message: "User job updated successfully"
 *               body:
 *                 jobTitle: "Software Engineer"
 *               status: 200
 */
router.patch("/update-job", authorize, userController.updateUserJob);

export default router;
