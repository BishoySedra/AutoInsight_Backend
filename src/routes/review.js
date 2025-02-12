import { Router } from "express";
import * as reviewController from "../controllers/review.js";
import authorize from "../middlewares/authorization/authorize.js"

const router = Router();

// Endpoint to add review
router.post("/", authorize, reviewController.addReview);

export default router;
