import { Router } from "express";
import * as userController from "../controllers/user.js";
import authorize from "../middlewares/authorization/authorize.js";
import uploadFile from "../middlewares/upload/file.js"

const router = Router();

// endpoint to update profile picture
router.put("/profile-picture", authorize, uploadFile, userController.updateProfilePicture);

export default router;