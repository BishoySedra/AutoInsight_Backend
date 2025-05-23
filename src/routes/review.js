import { Router } from "express";
import * as reviewController from "../controllers/review.js";
import authorize from "../middlewares/authorization/authorize.js";
import authorizeAdmin from "../middlewares/authorization/authorizeAdmin.js";

const router = Router();

/**
 * @swagger
 * /reviews:
 *   post:
 *     summary: Add a new review
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rating:
 *                 type: number
 *                 example: 4.5
 *               comment:
 *                 type: string
 *                 example: "Great service!"
 *     responses:
 *       201:
 *         description: Successfully added review
 *         content:
 *           application/json:
 *             example:
 *               message: "Review added successfully"
 *               body:
 *                 id: "12345"
 *                 rating: 4.5
 *                 comment: "Great service!"
 *               status: 201
 */
// Endpoint to add review
router.post("/", authorize, reviewController.addReview);

/**
 * @swagger
 * /reviews:
 *   get:
 *     summary: Get all reviews with pagination
 *     tags: [Reviews]
 *     responses:
 *       200:
 *         description: Successfully retrieved reviews
 *         content:
 *           application/json:
 *             example:
 *               message: "Successfully retrieved reviews"
 *               body:
 *                 reviews:
 *                   - id: "1"
 *                     rating: 4.5
 *                     comment: "Great service!"
 *                   - id: "2"
 *                     rating: 3.8
 *                     comment: "Good experience"
 *               status: 200
 */
// Endpoint to get all reviews using pagination
router.get("/", reviewController.getAllReviews);

/**
 * @swagger
 * /reviews/reviews_stats:
 *   get:
 *     summary: Get review statistics
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved review statistics
 *         content:
 *           application/json:
 *             example:
 *               message: "Successfully retrieved review statistics"
 *               body:
 *                 totalReviews: 100
 *                 averageRating: 4.2
 *               status: 200
 */
router.get("/reviews_stats", authorizeAdmin, reviewController.getReviewsCounts);

/**
 * @swagger
 * /reviews/{id}:
 *   get:
 *     summary: Get a review by ID
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Review ID
 *     responses:
 *       200:
 *         description: Successfully retrieved review
 *         content:
 *           application/json:
 *             example:
 *               message: "Successfully retrieved review"
 *               body:
 *                 id: "12345"
 *                 rating: 4.5
 *                 comment: "Great service!"
 *               status: 200
 */
// Endpoint to get a review by ID
router.get("/:id", authorize, reviewController.getReviewById);

/**
 * @swagger
 * /reviews/{id}:
 *   put:
 *     summary: Update a review by ID
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Review ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rating:
 *                 type: number
 *                 example: 4.8
 *               comment:
 *                 type: string
 *                 example: "Excellent service!"
 *     responses:
 *       200:
 *         description: Successfully updated review
 *         content:
 *           application/json:
 *             example:
 *               message: "Review updated successfully"
 *               body:
 *                 id: "12345"
 *                 rating: 4.8
 *                 comment: "Excellent service!"
 *               status: 200
 */
// Endpoint to update a review by ID
router.put("/:id", authorize, reviewController.updateReviewById);

/**
 * @swagger
 * /reviews/{id}:
 *   delete:
 *     summary: Delete a review by ID
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Review ID
 *     responses:
 *       200:
 *         description: Successfully deleted review
 *         content:
 *           application/json:
 *             example:
 *               message: "Review deleted successfully"
 *               body: {}
 *               status: 200
 */
// Endpoint to delete a review by ID
router.delete("/:id", authorize, reviewController.deleteReviewById);

export default router;