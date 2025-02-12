import * as reviewService from "../services/review.js";
import { wrapper } from "../utils/wrapper.js";
import { sendResponse } from "../utils/response.js";

// Controller to add a review
export const addReview = async (req, res, next) => {
    wrapper(async (req, res, next) => {
        const reviewData = req.body;
        const user_id = req.userId;
        const review = await reviewService.addReview(user_id, reviewData);
        return sendResponse(res, review, "Review added successfully", 201);
    })(req, res, next);
};