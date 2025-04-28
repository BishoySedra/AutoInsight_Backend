import * as userService from "../services/user.js";
import { wrapper } from "../utils/wrapper.js";
import { sendResponse } from "../utils/response.js";


// Get all Users
export const getRecentUsers = async (req, res, next) => {
    wrapper(async (req, res, next) => {
        // getting all users from user service
        const users = await userService.getRecentUsers();

        // sending response to client
        sendResponse(res, users, "Users fetched successfully", 200);

    })(req, res, next);
}
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

export const searchUsers = async (req, res, next) => {
    try {
      const { username } = req.query;
      
      if (!username) {
        return res.status(400).json({ error: 'Username query parameter is required' });
      }
      
      const users = await userService.searchUsersByUsername(username);
      return res.status(200).json({ success: true, data: users });
    } catch (error) {
      next(error); // Forward error to your global error handler
    }
  };


export const getUserDataById = async (req, res, next) => {
    wrapper(async (req, res, next) => {
        const id = req.params.id;
        const data = await userService.getUserData(id);
        sendResponse(res, data, 'user details fetched successfully', 200);
    })(req, res, next);
}   

export const getNumberOfUsers = async (req, res, next) => {
    wrapper(async (req, res, next) => {
        const data = await userService.getNumberOfUsers();
        sendResponse(res, data, 'number of users fetched successfully', 200);
    })(req, res, next);
}
