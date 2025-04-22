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
        members: {
            type: [mongoose.Schema.Types.ObjectId],
            ref: "User",
            default: []
        },
        memberPermission: {
            type: String,
            enum: ["view", "edit", "admin"],
            default: "view",
        },
        datasets: {
            type: [mongoose.Schema.Types.ObjectId],
            ref: "Dataset",
            default: []
        },
    },
    { timestamps: true }
);

const Team = mongoose.model("Team", TeamSchema);
export default Team;
