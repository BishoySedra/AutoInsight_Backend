import { Router } from "express";
import * as authController from "../controllers/auth.js";
import validate from "../middlewares/validation/validate.js";
import * as userSchemas from "../middlewares/validation/schemas/user.js";
import dotenv from "dotenv";
import authorize from '../middlewares/authorization/authorize.js';

dotenv.config();

const router = Router();

/**
 * @swagger
 * /auth/signup:
 *   post:
 *     summary: Sign up a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: "johndoe"
 *               email:
 *                 type: string
 *                 example: "johndoe@example.com"
 *               password:
 *                 type: string
 *                 example: "password123"
 *     responses:
 *       201:
 *         description: User signed up successfully
 *         content:
 *           application/json:
 *             example:
 *               message: "User signed up successfully"
 *               body:
 *                 id: "12345"
 *                 username: "johndoe"
 *                 email: "johndoe@example.com"
 *               status: 201
 */
// route to sign up a new user
router.post("/signup", validate(userSchemas.signUpSchema), authController.signUpUser);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Log in a user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "johndoe@example.com"
 *               password:
 *                 type: string
 *                 example: "password123"
 *     responses:
 *       200:
 *         description: User logged in successfully
 *         content:
 *           application/json:
 *             example:
 *               message: "User logged in successfully"
 *               body:
 *                 token: "jwt-token"
 *               status: 200
 */
// route to login a user
router.post("/login", validate(userSchemas.loginSchema), authController.loginUser);

/**
 * @swagger
 * /auth/change-password:
 *   patch:
 *     summary: Change user password
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               oldPassword:
 *                 type: string
 *                 example: "oldpassword123"
 *               newPassword:
 *                 type: string
 *                 example: "newpassword123"
 *     responses:
 *       200:
 *         description: Password changed successfully
 *         content:
 *           application/json:
 *             example:
 *               message: "Password changed successfully"
 *               body: {}
 *               status: 200
 */
// route to login a user
router.patch("/change-password", authorize, authController.changePassword);

/**
 * @swagger
 * /auth/forgot-password:
 *   post:
 *     summary: Request a password reset
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "johndoe@example.com"
 *     responses:
 *       200:
 *         description: Password reset request sent successfully
 *         content:
 *           application/json:
 *             example:
 *               message: "Password reset request sent successfully"
 *               body: {}
 *               status: 200
 */
// route to forgot password
router.post('/forgot-password', authController.forgetPassword);

/**
 * @swagger
 * /auth/reset-password:
 *   post:
 *     summary: Reset user password
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *                 example: "reset-token"
 *               newPassword:
 *                 type: string
 *                 example: "newpassword123"
 *     responses:
 *       200:
 *         description: Password reset successfully
 *         content:
 *           application/json:
 *             example:
 *               message: "Password reset successfully"
 *               body: {}
 *               status: 200
 */
// route to reset password
router.post('/reset-password', authController.resetPassword);

/**
 * @swagger
 * /auth/google:
 *   get:
 *     summary: Start Google login
 *     tags: [Authentication]
 *     responses:
 *       200:
 *         description: Redirected to Google login
 *         content:
 *           application/json:
 *             example:
 *               message: "Redirected to Google login"
 *               body: {}
 *               status: 200
 */
// Start Google login
router.get("/google", authController.startLoginWithGoogle);

/**
 * @swagger
 * /auth/google/callback:
 *   get:
 *     summary: Handle Google login callback
 *     tags: [Authentication]
 *     responses:
 *       200:
 *         description: Google login callback handled successfully
 *         content:
 *           application/json:
 *             example:
 *               message: "Google login callback handled successfully"
 *               body:
 *                 token: "jwt-token"
 *               status: 200
 */
// Handle callback from Google
router.get("/google/callback", authController.handleGoogleCallback);

/**
 * @swagger
 * /auth/github:
 *   get:
 *     summary: Start GitHub login
 *     tags: [Authentication]
 *     responses:
 *       200:
 *         description: Redirected to GitHub login
 *         content:
 *           application/json:
 *             example:
 *               message: "Redirected to GitHub login"
 *               body: {}
 *               status: 200
 */
// Start GitHub login
router.get("/github", authController.startLoginWithGithub);

/**
 * @swagger
 * /auth/github/callback:
 *   get:
 *     summary: Handle GitHub login callback
 *     tags: [Authentication]
 *     responses:
 *       200:
 *         description: GitHub login callback handled successfully
 *         content:
 *           application/json:
 *             example:
 *               message: "GitHub login callback handled successfully"
 *               body:
 *                 token: "jwt-token"
 *               status: 200
 */
// Handle callback from GitHub
router.get("/github/callback", authController.handleGithubCallback);

/**
 * @swagger
 * /auth/facebook:
 *   get:
 *     summary: Start Facebook login
 *     tags: [Authentication]
 *     responses:
 *       200:
 *         description: Redirected to Facebook login
 *         content:
 *           application/json:
 *             example:
 *               message: "Redirected to Facebook login"
 *               body: {}
 *               status: 200
 */
// Start Facebook login
router.get("/facebook", authController.startLoginWithFacebook);

/**
 * @swagger
 * /auth/facebook/callback:
 *   get:
 *     summary: Handle Facebook login callback
 *     tags: [Authentication]
 *     responses:
 *       200:
 *         description: Facebook login callback handled successfully
 *         content:
 *           application/json:
 *             example:
 *               message: "Facebook login callback handled successfully"
 *               body:
 *                 token: "jwt-token"
 *               status: 200
 */
// Handle callback from Facebook
router.get("/facebook/callback", authController.handleFacebookCallback);

export default router;