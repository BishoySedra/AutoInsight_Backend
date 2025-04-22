// models/Team.js
import mongoose from "mongoose";

const TeamSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        members: [
            {
                user_id: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User",
                },
                permission: {
                    type: String,
                    enum: ['view', 'edit', 'admin'],
                    default: 'view'
                },
            },
        ],
        datasets: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Dataset",
            },
        ],
    },
    { timestamps: true }
);

const Team = mongoose.model("Team", TeamSchema);
export default Team;
