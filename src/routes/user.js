import { Router } from "express";
import * as userController from "../controllers/user.js";
import authorize from "../middlewares/authorization/authorize.js";
import authorizeAdmin from "../middlewares/authorization/authorizeAdmin.js";
import uploadFile from "../middlewares/upload/file.js"

const router = Router();


// endpoint to get jobs counts
router.get("/jobs-count", authorizeAdmin, userController.getJobsCounts);

// endpoint to get jobs counts
router.get("/users-months", authorizeAdmin, userController.getNumberOfUsersByMonth);

// endpoint to get countries counts
router.get("/country-count", authorizeAdmin, userController.getCountryCounts);

// endpoint to get user id by username or email
router.get("/user-id", authorize, userController.getUserId);

// endpoint to return user data
router.get("/user-data", authorize, userController.getUserDetails);

// endpoint to return users numbers
router.get("/users-no", authorize, userController.getNumberOfUsers);

// endpoint to search users
router.get('/search', userController.searchUsers);

// endpoint to get recent users
router.get('/recent-4-users', authorizeAdmin, userController.getRecentUsers);

// endpoint to get user data by id
router.get('/:id', authorize, userController.getUserDataById);

// endpoint to update profile picture
router.put("/profile-picture", authorize, uploadFile, userController.updateProfilePicture);

router.patch("/update-job", authorize, userController.updateUserJob);

export default router;
