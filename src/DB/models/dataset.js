import mongoose from "mongoose";

const DatasetSchema = new mongoose.Schema(
    {
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        dataset_name: {
            type: String,
            required: true,
            trim: true,
        },
        dataset_url: {
            type: String,
            required: true,
            trim: true,
        },
        permissions: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],
        insights_urls: [
            {
                type: String,
                trim: true,
            },
        ],
    },
    { timestamps: true } // Automatically adds createdAt and updatedAt
);

const Dataset = mongoose.model("Dataset", DatasetSchema);

export default Dataset;
