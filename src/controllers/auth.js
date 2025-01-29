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

