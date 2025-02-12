import Review from "../DB/models/review.js";
import { createCustomError } from "../middlewares/errors/customError.js";

// Service to add a review
export const addReview = async (user_id, reviewData) => {
    const { rating, description } = reviewData;

    if (!user_id || !rating) {
        throw createCustomError("User ID and rating are required", 400);
    }

    if (rating < 1 || rating > 5) {
        throw createCustomError("Rating must be between 1 and 5", 400);
    }

    const review = new Review({ user_id, rating, description });
    return await review.save();
};