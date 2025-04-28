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
        business_domain: {
            type: String,
            required: true,
        },
        dataset_url: {
            type: String,
            required: true,
            trim: true,
        },
        cleaned_dataset_url: {
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
            bar_chart: [{
                url: { type: String, trim: true },
                filterNumber: { type: Number, }
            }],
            kde: [{ type: String, trim: true }],
            histogram: [{
                url: { type: String, trim: true },
                filterNumber: { type: Number, }
            }],
            correlation: [{ type: String, trim: true }],
            forecast: [{
                url: { type: String, trim: true },
                filterNumber: { type: Number, }
            }],
            others: [{ type: String, trim: true }],
        },
        // insights_urls: {
        //     type: Map,
        //     of: [{
        //       url: { type: String, trim: true },
        //       filterNumber: { type: Number, required: false }
        //     }],
        //     default: {}
        //   }
    },
    { timestamps: true } // Automatically adds createdAt and updatedAt
);

const Dataset = mongoose.model("Dataset", DatasetSchema);

export default Dataset;
