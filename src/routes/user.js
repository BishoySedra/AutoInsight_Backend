import { Router } from "express";
import * as userController from "../controllers/user.js";
import authorize from "../middlewares/authorization/authorize.js";
import uploadFile from "../middlewares/upload/file.js"

const router = Router();

// endpoint to update profile picture
router.put("/profile-picture", authorize, uploadFile, userController.updateProfilePicture);

// endpoint to get user id by username or email
router.get("/user-id", userController.getUserId);


// endpoint to return user data
router.get("/user-data", userController.getUserDetails);

export default router;
