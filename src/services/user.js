import User from "../DB/models/user.js";
import dotenv from "dotenv";
import axios from "axios";
import FormData from "form-data";
import fs from "fs";
import { createCustomError } from "../middlewares/errors/customError.js";

dotenv.config();

// Service to update profile picture
export const updateProfilePicture = async (user_id, profilePictureURL) => {
    // console.log(profilePictureURL);
    // console.log(user_id);

    // Check if user exists
    const user = await User.findById(user_id);

    if (!user) {
        throw createCustomError(`User not found`, 404);
    }

    // Update profile picture
    user.profile_picture = profilePictureURL;

    await user.save();
}
