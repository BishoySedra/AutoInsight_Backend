import * as authService from "../services/auth.js";
import { wrapper } from "../utils/wrapper.js";
import { sendResponse } from "../utils/response.js";

export const signUpUser = async (req, res, next) => {
    wrapper(async (req, res, next) => {
        const userData = req.body;
        const user = await authService.signUpUser(userData);

        return sendResponse(res, user, "User signed up successfully", 201);
    })(req, res, next);
};

export const loginUser = async (req, res, next) => {
    wrapper(async (req, res, next) => {
        const userData = req.body;
        const user = await authService.loginUser(userData);

        return sendResponse(res, user, "User logged in successfully", 200);
    })(req, res, next);
};

export const forgetPassword = async (req, res, next) => {
    wrapper(async (req, res, next) => {
        const { email } = req.body;
        const resetToken = await authService.generatePasswordResetToken(email);    
        return sendResponse(res, {}, "If a user with that email exists, a password reset link has been sent", 200);
    })(req, res, next);
};

export const resetPassword = async (req, res, next) => {
    wrapper(async (req, res, next) => {
        const { token, newPassword } = req.body;
        if (!token || newPassword === "")
            return sendResponse(res, {}, "Please provide token and new password", 400);
        await authService.resetPassword(token, newPassword);
        
        return sendResponse(res, {}, "Password reset successfully", 200);
    })(req, res, next);
};

