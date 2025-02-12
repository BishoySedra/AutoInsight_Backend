import mongoose from "mongoose";

// review schema
// user_id: reference to the user who created the review
// rating: rating given by the user
// description: review description
// created_at: review creation date
// updated_at: review updation date

const reviewSchema = new mongoose.Schema(
    {
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        rating: {
            type: Number,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

const Review = mongoose.model("Review", reviewSchema);

export default Review;

