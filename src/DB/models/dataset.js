import mongoose from "mongoose";

const DatasetSchema = new mongoose.Schema(
    {
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        dataset_name: { // 2olna hn save fe cloudinary feen ?
            type: String,
            required: true,
            trim: true,
        },
        dataset_url: {
            type: String,
            required: true,
            trim: true,
        },
        cleaned_dataset_url : {
            type: String,
            trim: true,
        },
        shared_usernames: [
            {
                type: String,
                trim: true,
            },
        ],
        insights_urls: {
            pie_chart: [{ type: String, trim: true }],
            bar_chart: [{ type: String, trim: true }],
            kde: [{ type: String, trim: true }],
            histogram: [{ type: String, trim: true }],
            correlation: [{ type: String, trim: true }],
        },
    },
    { timestamps: true } // Automatically adds createdAt and updatedAt
);

const Dataset = mongoose.model("Dataset", DatasetSchema);

export default Dataset;
