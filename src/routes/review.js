import { Router } from "express";
import * as reviewController from "../controllers/review.js";
import authorize from "../middlewares/authorization/authorize.js"

const router = Router();

// Endpoint to add review
router.post("/", authorize, reviewController.addReview);

// endpoint to get all reviews using pagination
router.get("/", authorize, reviewController.getAllReviews);

// endpoint to get a review by ID
router.get("/:id", authorize, reviewController.getReviewById);

// endpoint to update a review by ID
router.put("/:id", authorize, reviewController.updateReviewById);

// endpoint to delete a review by ID
router.delete("/:id", authorize, reviewController.deleteReviewById);


export default router;
