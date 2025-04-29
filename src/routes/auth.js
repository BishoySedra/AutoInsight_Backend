import { Router } from "express";
import * as authController from "../controllers/auth.js";
import validate from "../middlewares/validation/validate.js";
import * as userSchemas from "../middlewares/validation/schemas/user.js";
import dotenv from "dotenv";

dotenv.config();

const router = Router();

// route to sign up a new user
router.post("/signup", validate(userSchemas.signUpSchema), authController.signUpUser);

// route to login a user
router.post("/login", validate(userSchemas.loginSchema), authController.loginUser);

// route to login a user
router.patch("/change-password", authController.changePassword);

// route to forgot password
router.post('/forgot-password', authController.forgetPassword);

// route to reset password
router.post('/reset-password', authController.resetPassword);

// Start Google login
router.get("/google", authController.startLoginWithGoogle);

// Handle callback from Google
router.get("/google/callback", authController.handleGoogleCallback);

// Start GitHub login
router.get("/github", authController.startLoginWithGithub);

// Handle callback from GitHub
router.get("/github/callback", authController.handleGithubCallback);

// Start Facebook login
router.get("/facebook", authController.startLoginWithFacebook);

// Handle callback from Facebook
router.get("/facebook/callback", authController.handleFacebookCallback);


export default router;