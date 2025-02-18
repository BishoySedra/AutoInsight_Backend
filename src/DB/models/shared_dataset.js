import mongoose from "mongoose";

const SharedDatasetSchema = new mongoose.Schema(
    {
        dataset_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Dataset",
            required: true,
        },
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    { timestamps: true } // Automatically adds createdAt and updatedAt
);

const SharedDataset = mongoose.model("SharedDataset", SharedDatasetSchema);

export default SharedDataset;