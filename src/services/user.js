import User from "../DB/models/user.js";
import dotenv from "dotenv";
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

// Service to get user id by username or email
export const getUserId = async (username, email) => {
    // Check if username or email is provided
    if (!username && !email) {
        throw createCustomError(`Username or email is required`, 400);
    }

    // Check if user exists
    const user = await User.findOne({ $or: [{ username: username }, { email: email }] });

    if (!user) {
        throw createCustomError(`User not found`, 404);
    }

    return user._id;
}

// Service to get user data by user id
export const getUserData = async (userId) => {
    const user = await User.findById(userId).select("-password");
    if (!user) {
        throw createCustomError(`User not found`, 404);
    }
    return user;
};

// service to search users by username
export const searchUsersByUsername = async (username) => {
    try {
        // Use a case-insensitive regular expression for partial matching
        const users = await User.find({
            username: { $regex: username, $options: 'i' }
        });
        return users;
    } catch (error) {
        throw error;
    }
};

// service to get user by email
export const getUserByEmail = async (email) => {
    const user = await User.find({ email }).select("-password");
    if (!user) {
        throw createCustomError(`User not found`, 404);
    }
    return user;
}