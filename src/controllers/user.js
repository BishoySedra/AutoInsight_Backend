import * as userService from "../services/user.js";
import { wrapper } from "../utils/wrapper.js";
import { sendResponse } from "../utils/response.js";

// Controller to update profile picture
export const updateProfilePicture = async (req, res, next) => {
    wrapper(async (req, res, next) => {

        // getting user id and profile picture url from request
        const user_id = req.userId;
        const profilePictureURL = req.file_url;

        // updating profile picture
        await userService.updateProfilePicture(user_id, profilePictureURL);

        // sending response to client
        sendResponse(res, null, "Profile picture updated successfully", 200);

    })(req, res, next);
};

// Controller to get user id by username or email
export const getUserId = async (req, res, next) => {
    wrapper(async (req, res, next) => {

        // getting username or email from request
        const { username, email } = req.query;

        // getting user id by username or email
        const user_id = await userService.getUserId(username, email);

        // sending response to client
        sendResponse(res, user_id, "User id fetched successfully", 200);

    })(req, res, next);
};

export const getUserDetails = async (req, res, next) => {
    wrapper(async (req, res, next) => {
        const id = req.userId;
        const data = await userService.getUserData(id);
        sendResponse(res, data, 'user details fetched successfully', 200);
    })(req, res, next);
}
