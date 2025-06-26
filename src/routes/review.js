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
 *               description:
 *                 type: string
 *                 example: "The product quality is excellent!"
 *     responses:
 *       201:
 *         description: Successfully added review
 *         content:
 *           application/json:
 *             example:
 *               message: "Review added successfully"
 *               body:
 *                 id: "64f1a2b3c4d5e6f7g8h9i0j1"
 *                 rating: 4.5
 *                 description: "The product quality is excellent!"
 *                 sentiment: "positive"
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
 *         description: Number of reviews per page
 *     responses:
 *       200:
 *         description: Successfully retrieved reviews
 *         content:
 *           application/json:
 *             example:
 *               message: "Reviews fetched successfully"
 *               body:
 *                 reviews:
 *                   - id: "64f1a2b3c4d5e6f7g8h9i0j1"
 *                     rating: 4.5
 *                     description: "The product quality is excellent!"
 *                     sentiment: "positive"
 *                     user:
 *                       id: "12345"
 *                       name: "John Doe"
 *                   - id: "64f1a2b3c4d5e6f7g8h9i0j2"
 *                     rating: 3.0
 *                     description: "Average experience."
 *                     sentiment: "neutral"
 *                     user:
 *                       id: "67890"
 *                       name: "Jane Smith"
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
 *                 totalReviews: 150
 *                 negative: 30
 *                 neutral: 50
 *                 positive: 70
 *               status: 200
 */
// Endpoint to get review statistics
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
 *               message: "Review fetched successfully"
 *               body:
 *                 id: "64f1a2b3c4d5e6f7g8h9i0j1"
 *                 rating: 4.5
 *                 description: "The product quality is excellent!"
 *                 sentiment: "positive"
 *                 user:
 *                   id: "12345"
 *                   name: "John Doe"
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
 *               description:
 *                 type: string
 *                 example: "The service was outstanding!"
 *     responses:
 *       200:
 *         description: Successfully updated review
 *         content:
 *           application/json:
 *             example:
 *               message: "Review updated successfully"
 *               body:
 *                 id: "64f1a2b3c4d5e6f7g8h9i0j1"
 *                 rating: 4.8
 *                 description: "The service was outstanding!"
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