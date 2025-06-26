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
 *     summary: Register a new user
 *     description: Allows a new user to create an account by providing required details.
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SignUpRequest'
 *     responses:
 *       201:
 *         description: User registered successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SignUpResponse'
 *       400:
 *         description: Bad request, validation error, or username/email already taken.
 *         content:
 *           application/json:
 *             example:
 *               message: "Username already taken"
 *               status: 400
 */
// route to sign up a new user
router.post("/signup", validate(userSchemas.signUpSchema), authController.signUpUser);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Authenticate a user
 *     description: Logs in a user by validating their credentials and returns a JWT token.
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: User authenticated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *       400:
 *         description: Invalid credentials or validation error.
 *         content:
 *           application/json:
 *             example:
 *               message: "Invalid credentials"
 *               status: 400
 */
// route to login a user
router.post("/login", validate(userSchemas.loginSchema), authController.loginUser);

/**
 * @swagger
 * /auth/change-password:
 *   patch:
 *     summary: Update user password
 *     description: Allows an authenticated user to change their password by providing the old and new passwords.
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ChangePasswordRequest'
 *     responses:
 *       200:
 *         description: Password updated successfully.
 *         content:
 *           application/json:
 *             example:
 *               message: "Password updated successfully"
 *               status: 200
 *       400:
 *         description: Invalid credentials or validation error.
 *         content:
 *           application/json:
 *             example:
 *               message: "Old password is incorrect"
 *               status: 400
 */
// route to login a user
router.patch("/change-password", authorize, authController.changePassword);

/**
 * @swagger
 * /auth/forgot-password:
 *   post:
 *     summary: Request password reset
 *     description: Sends a password reset link to the user's email if the email exists in the system.
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ForgotPasswordRequest'
 *     responses:
 *       200:
 *         description: Password reset link sent successfully.
 *         content:
 *           application/json:
 *             example:
 *               message: "If a user with that email exists, a password reset link has been sent"
 *               status: 200
 *       400:
 *         description: Validation error.
 *         content:
 *           application/json:
 *             example:
 *               message: "Invalid email format"
 *               status: 400
 */
// route to forgot password
router.post('/forgot-password', authController.forgetPassword);

/**
 * @swagger
 * /auth/reset-password:
 *   post:
 *     summary: Reset user password
 *     description: Resets the user's password using a valid reset token.
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ResetPasswordRequest'
 *     responses:
 *       200:
 *         description: Password reset successfully.
 *         content:
 *           application/json:
 *             example:
 *               message: "Password reset successfully"
 *               status: 200
 *       400:
 *         description: Invalid or expired token, or validation error.
 *         content:
 *           application/json:
 *             example:
 *               message: "Invalid or expired token"
 *               status: 400
 */
// route to reset password
router.post('/reset-password', authController.resetPassword);

/**
 * @swagger
 * /auth/google:
 *   get:
 *     summary: Initiate Google login
 *     description: Redirects the user to Google's OAuth login page.
 *     tags: [Authentication]
 *     responses:
 *       200:
 *         description: Redirected to Google login.
 *         content:
 *           application/json:
 *             example:
 *               message: "Redirected to Google login"
 *               status: 200
 */
// Start Google login
router.get("/google", authController.startLoginWithGoogle);

/**
 * @swagger
 * /auth/google/callback:
 *   get:
 *     summary: Handle Google login callback
 *     description: Handles the callback from Google after successful authentication.
 *     tags: [Authentication]
 *     responses:
 *       200:
 *         description: Google login callback handled successfully.
 *         content:
 *           application/json:
 *             example:
 *               message: "Google login callback handled successfully"
 *               token: "jwt-token"
 *               status: 200
 */
// Handle callback from Google
router.get("/google/callback", authController.handleGoogleCallback);

/**
 * @swagger
 * /auth/github:
 *   get:
 *     summary: Initiate GitHub login
 *     description: Redirects the user to GitHub's OAuth login page.
 *     tags: [Authentication]
 *     responses:
 *       200:
 *         description: Redirected to GitHub login.
 *         content:
 *           application/json:
 *             example:
 *               message: "Redirected to GitHub login"
 *               status: 200
 */
// Start GitHub login
router.get("/github", authController.startLoginWithGithub);

/**
 * @swagger
 * /auth/github/callback:
 *   get:
 *     summary: Handle GitHub login callback
 *     description: Handles the callback from GitHub after successful authentication.
 *     tags: [Authentication]
 *     responses:
 *       200:
 *         description: GitHub login callback handled successfully.
 *         content:
 *           application/json:
 *             example:
 *               message: "GitHub login callback handled successfully"
 *               token: "jwt-token"
 *               status: 200
 */
// Handle callback from GitHub
router.get("/github/callback", authController.handleGithubCallback);

/**
 * @swagger
 * /auth/facebook:
 *   get:
 *     summary: Initiate Facebook login
 *     description: Redirects the user to Facebook's OAuth login page.
 *     tags: [Authentication]
 *     responses:
 *       200:
 *         description: Redirected to Facebook login.
 *         content:
 *           application/json:
 *             example:
 *               message: "Redirected to Facebook login"
 *               status: 200
 */
// Start Facebook login
router.get("/facebook", authController.startLoginWithFacebook);

/**
 * @swagger
 * /auth/facebook/callback:
 *   get:
 *     summary: Handle Facebook login callback
 *     description: Handles the callback from Facebook after successful authentication.
 *     tags: [Authentication]
 *     responses:
 *       200:
 *         description: Facebook login callback handled successfully.
 *         content:
 *           application/json:
 *             example:
 *               message: "Facebook login callback handled successfully"
 *               token: "jwt-token"
 *               status: 200
 */
// Handle callback from Facebook
router.get("/facebook/callback", authController.handleFacebookCallback);

/**
 * @swagger
 * components:
 *   schemas:
 *     SignUpRequest:
 *       type: object
 *       properties:
 *         username:
 *           type: string
 *           example: "johndoe"
 *         email:
 *           type: string
 *           example: "johndoe@example.com"
 *         password:
 *           type: string
 *           example: "password123"
 *         confirm_password:
 *           type: string
 *           example: "password123"
 *     SignUpResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "User signed up successfully"
 *         body:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *               example: "12345"
 *             username:
 *               type: string
 *               example: "johndoe"
 *             email:
 *               type: string
 *               example: "johndoe@example.com"
 *         status:
 *           type: integer
 *           example: 201
 *     LoginRequest:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *           example: "johndoe@example.com"
 *         password:
 *           type: string
 *           example: "password123"
 *     LoginResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "User logged in successfully"
 *         body:
 *           type: object
 *           properties:
 *             token:
 *               type: string
 *               example: "jwt-token"
 *         status:
 *           type: integer
 *           example: 200
 *     ChangePasswordRequest:
 *       type: object
 *       properties:
 *         oldPassword:
 *           type: string
 *           example: "oldpassword123"
 *         newPassword:
 *           type: string
 *           example: "newpassword123"
 *     ForgotPasswordRequest:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *           example: "johndoe@example.com"
 *     ResetPasswordRequest:
 *       type: object
 *       properties:
 *         token:
 *           type: string
 *           example: "reset-token"
 *         newPassword:
 *           type: string
 *           example: "newpassword123"
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

export default router;