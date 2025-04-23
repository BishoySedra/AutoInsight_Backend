import Review from "../DB/models/review.js";
import User from "../DB/models/user.js";
import { createCustomError } from "../middlewares/errors/customError.js";
import axios from 'axios';

// Service to add a review

export const analyzeSentiment = async (review) => {
    const response = await axios.post(`${process.env.FASTAPI_URL}/predict-review`, { review });
    console.log(response.data);
    // { sentiment: 'negative', confidence: 62.49, sarcasm_detected: false }
    return response.data;
}

export const getReviewsCounts = async () => {
    const reviews = await Review.find({});
    const result = {
        negative: 0,
        neutral: 0,
        positive: 0
      };
    reviews.forEach(item => {
        result[item.sentiment]++;
      });
    return result;
}

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

// Service to get all reviews using pagination
export const getAllReviews = async (page = 1, limit = 10) => {
    const skip = (page - 1) * limit;
    const reviews = await Review.find().skip(skip).limit(limit).select("-__v");

    // Populate the user details
    const reviewsWithUser = await Promise.all(reviews.map(async (review) => {
        const user = await User.findById(review.user_id).select("-password -__v");
        return { ...review._doc, user };
    }));

    console.log(reviewsWithUser);
    return reviewsWithUser;
};

// Service to get a review by ID
export const getReviewById = async (id) => {
    const review = await Review.findById(id);

    if (!review) {
        throw createCustomError("No review found with this ID", 404);
    }

    // console.log(review.user_id);

    // Populate the user details
    const user = await User.findById(review.user_id).select("-password -__v");

    // console.log(user);

    // add user details to the review object
    const reviewWithUser = { ...review._doc, user };

    return reviewWithUser;
};

// Service to update a review by ID
export const updateReviewById = async (id, reviewData) => {
    const { rating, description } = reviewData;

    if (!rating) {
        throw createCustomError("Rating is required", 400);
    }

    if (rating < 1 || rating > 5) {
        throw createCustomError("Rating must be between 1 and 5", 400);
    }

    const review = await Review.findByIdAndUpdate(id, reviewData, { new: true });

    if (!review) {
        throw createCustomError("No review found with this ID", 404);
    }

    return review;
};

// Service to delete a review by ID
export const deleteReviewById = async (id) => {
    const review = await Review.findByIdAndDelete(id);

    if (!review) {
        throw createCustomError("No review found with this ID", 404);
    }
};