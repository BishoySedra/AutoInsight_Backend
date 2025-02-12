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