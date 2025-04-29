import * as authService from "../services/auth.js";
import { wrapper } from "../utils/wrapper.js";
import { sendResponse } from "../utils/response.js";
import passport from "../config/passport.js";
import dotenv from "dotenv";
import * as JWTOps from "../utils/jwt.js";

dotenv.config();

// This function handles user sign-up
export const signUpUser = async (req, res, next) => {
    wrapper(async (req, res, next) => {
        const userData = req.body;
        const user = await authService.signUpUser(userData);

        return sendResponse(res, user, "User signed up successfully", 201);
    })(req, res, next);
};

// This function handles user login
export const loginUser = async (req, res, next) => {
    wrapper(async (req, res, next) => {
        const userData = req.body;
        const user = await authService.loginUser(userData);

        return sendResponse(res, user, "User logged in successfully", 200);
    })(req, res, next);
};

// This function handles user forgot password
export const forgetPassword = async (req, res, next) => {
    wrapper(async (req, res, next) => {
        const { email } = req.body;
        const resetToken = await authService.generatePasswordResetToken(email);
        return sendResponse(res, {}, "If a user with that email exists, a password reset link has been sent", 200);
    })(req, res, next);
};

// This function handles user password reset
export const resetPassword = async (req, res, next) => {
    wrapper(async (req, res, next) => {
        const { token, newPassword } = req.body;
        if (!token || newPassword === "")
            return sendResponse(res, {}, "Please provide token and new password", 400);
        await authService.resetPassword(token, newPassword);

        return sendResponse(res, {}, "Password reset successfully", 200);
    })(req, res, next);
};

// Change password

export const changePassword = (req, res, next) => {
    wrapper(async (req, res, next) => {
        const { oldPassword, newPassword } = req.body;
        const user = await authService.changePassword(req.userId, oldPassword, newPassword);
        return user;
    })(req, res, next);
}

// Start login with Google
export const startLoginWithGoogle = (req, res, next) => {
    passport.authenticate("google", { scope: ["profile", "email"] })(req, res, next);
};

// Handle callback from Google
export const handleGoogleCallback = (req, res, next) => {
    passport.authenticate("google", { session: false, failureRedirect: "/login" }, (err, user) => {
        if (err || !user) {
            return sendResponse(res, null, "Failed to authenticate user", 401);
        }

        try {
            const token = JWTOps.generateToken({ id: user._id });

            return res.redirect(`${process.env.FRONTEND_URL}/successLoginPage?token=${token}`);
        } catch (error) {
            next(error);
        }
    })(req, res, next);
};

// Start login with GitHub
export const startLoginWithGithub = (req, res, next) => {
    passport.authenticate("github", { scope: ["user:email"] })(req, res, next);
};

// Handle callback from GitHub
export const handleGithubCallback = (req, res, next) => {
    passport.authenticate("github", { session: false, failureRedirect: "/login" }, (err, user) => {

        // console.log("User data from GitHub:", user);

        if (err || !user) {
            return sendResponse(res, err, "Failed to authenticate user", 401);
        }

        try {
            const token = JWTOps.generateToken({ id: user._id });

            return res.redirect(`${process.env.FRONTEND_URL}/successLoginPage?token=${token}`);
        } catch (error) {
            next(error);
        }
    })(req, res, next);
};

// Start login with Facebook
export const startLoginWithFacebook = (req, res, next) => {
    passport.authenticate("facebook")(req, res, next);
};

// Handle callback from Facebook
export const handleFacebookCallback = (req, res, next) => {
    passport.authenticate("facebook", { session: false, failureRedirect: "/login" }, (err, user) => {

        if (err || !user) {
            return sendResponse(res, null, "Failed to authenticate user", 401);
        }

        try {
            const token = JWTOps.generateToken({ id: user._id });

            return res.redirect(`${process.env.FRONTEND_URL}/successLoginPage?token=${token}`);
        } catch (error) {
            next(error);
        }
    })(req, res, next);
};
