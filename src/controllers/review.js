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

// Controller to get all reviews using pagination
export const getAllReviews = async (req, res, next) => {
    wrapper(async (req, res, next) => {
        const { page, limit } = req.query;
        const reviews = await reviewService.getAllReviews(page, limit);
        return sendResponse(res, reviews, "Reviews fetched successfully", 200);
    })(req, res, next);
};

// Controller to get a review by ID
export const getReviewById = async (req, res, next) => {
    wrapper(async (req, res, next) => {
        const { id } = req.params;
        const review = await reviewService.getReviewById(id);
        return sendResponse(res, review, "Review fetched successfully", 200);
    })(req, res, next);
};

// Controller to update a review by ID
export const updateReviewById = async (req, res, next) => {
    wrapper(async (req, res, next) => {
        const { id } = req.params;
        const reviewData = req.body;
        const review = await reviewService.updateReviewById(id, reviewData);
        return sendResponse(res, review, "Review updated successfully", 200);
    })(req, res, next);
};

// Controller to delete a review by ID
export const deleteReviewById = async (req, res, next) => {
    wrapper(async (req, res, next) => {
        const { id } = req.params;
        await reviewService.deleteReviewById(id);
        return sendResponse(res, null, "Review deleted successfully", 200);
    })(req, res, next);
};