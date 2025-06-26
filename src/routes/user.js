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
 *     summary: Retrieve the total number of jobs
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved the total number of jobs
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
 *     summary: Retrieve the number of users registered per month
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved user registration data
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
 *     summary: Retrieve the number of users by country
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved user counts by country
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
 *     summary: Retrieve a user's ID by their username or email
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: username
 *         schema:
 *           type: string
 *         description: The username of the user
 *       - in: query
 *         name: email
 *         schema:
 *           type: string
 *         description: The email address of the user
 *     responses:
 *       200:
 *         description: Successfully retrieved the user ID
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
 *     summary: Retrieve detailed information about the authenticated user
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
 *     summary: Retrieve the total number of users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Successfully retrieved the total number of users
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
 *     summary: Search for users based on a query
 *     tags: [Users]
 *     parameters:
 *       - in: query
 *         name: query
 *         schema:
 *           type: string
 *         description: The search query string
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
 *     summary: Retrieve the 4 most recently registered users
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved the most recent users
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
 *     summary: Retrieve detailed information about a user by their ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier of the user
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
 *     summary: Update the profile picture of the authenticated user
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
 *                 description: The profile picture file to upload
 *     responses:
 *       200:
 *         description: Successfully updated the profile picture
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
 *     summary: Update the job title of the authenticated user
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
 *                 description: The new job title for the user
 *     responses:
 *       200:
 *         description: Successfully updated the user's job title
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
