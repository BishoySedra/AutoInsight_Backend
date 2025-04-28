import { Router } from "express";
import * as userController from "../controllers/user.js";
import authorize from "../middlewares/authorization/authorize.js";
import uploadFile from "../middlewares/upload/file.js"

const router = Router();

// endpoint to get jobs counts
router.get("/jobs-count", userController.getJobsCounts);

// endpoint to get countries counts
router.get("/country-count", userController.getCountryCounts);

// endpoint to get user id by username or email
router.get("/user-id", userController.getUserId);

// endpoint to return user data
router.get("/user-data", authorize, userController.getUserDetails);

// endpoint to return user data
router.get("/users-no", authorize, userController.getNumberOfUsers);

// endpoint to search users
router.get('/search', userController.searchUsers);

// endpoint to get recent users
router.get('/recent-4-users', userController.getRecentUsers);

// endpoint to get user data by id
router.get('/:id', userController.getUserDataById);

// endpoint to update profile picture
router.put("/profile-picture", authorize, uploadFile, userController.updateProfilePicture);

export default router;
