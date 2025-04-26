import User from "../DB/models/user.js";
import { createCustomError } from "../middlewares/errors/customError.js";
import * as hashingOperations from "../utils/bcrypt.js";
import * as tokenOperations from "../utils/jwt.js";
import { EmailService } from '../services/email.js';
import { TokenRepository } from '../repositories/tokenRepository.js';
import { config } from '../config/config.js';
import { logger } from '../utils/logger.js';
import { NodemailerAdapter } from '../adapters/nodemailerAdapter.js';
import crypto from 'crypto';


// Factory for creating tokens
class TokenFactory {
    static createResetToken() {
        return crypto.randomBytes(32).toString('hex');
    }

    static hashToken(token) {
        return crypto.createHash('sha256').update(token).digest('hex');
    }
}

export const signUpUser = async (userData) => {
    // destructuring the userData object
    const { username, email, country, job, password, confirm_password } = userData;

    // check if the email already exists
    let foundUser = await User.findOne({
        username
    });

    // if the username already taken, throw an error
    if (foundUser) {
        throw createCustomError("Username already taken", 400, null);
    }

    foundUser = await User.findOne({
        email
    });

    // if the email already taken, throw an error
    if (foundUser) {
        throw createCustomError("Email already taken", 400, null);
    }

    // check if the password and confirm password match
    if (password !== confirm_password) {
        throw createCustomError("Passwords do not match", 400, null);
    }

    // hash the password
    const hashedPassword = await hashingOperations.hashPassword(password);

    // create a new user
    const newUser = new User({
        username,
        email,
        country,
        job,
        password: hashedPassword,
    });

    // save the user to the database
    await newUser.save();
};

export const loginUser = async (userData) => {
    // destructuring the userData object
    const { email, password } = userData;

    // check if the email exists
    const foundUser = await User.findOne({
        email,
    });

    if (!foundUser) {
        throw createCustomError("Invalid credentials", 400);
    }

    // check if the password is correct
    const isPasswordCorrect = await hashingOperations.comparePassword(
        password,
        foundUser.password
    );

    if (!isPasswordCorrect) {
        throw createCustomError("Invalid credentials", 400);
    }

    // generate a token
    const token = tokenOperations.generateToken({
        id: foundUser._id,
        email: foundUser.email,
    });

    return { token };
};

// Service Implementation with Design Patterns
export const generatePasswordResetToken = async (email) => {
    try {
        // Find user by email
        const user = await User.findOne({ email });

        // For security, don't reveal if user doesn't exist
        if (!user) {
            // logger.info(`Password reset attempted for non-existent email: ${email}`);
            return null; // Still return as successful to the controller
        }

        // Generate and hash token
        const resetToken = TokenFactory.createResetToken();
        const hashedToken = TokenFactory.hashToken(resetToken);

        // Save to repository
        const expiryTime = Date.now() + config.security.tokenExpiry;
        await TokenRepository.saveResetToken(user._id, hashedToken, expiryTime);

        // Send email using Dependency Injection
        const emailProvider = new NodemailerAdapter();
        const emailService = new EmailService(emailProvider);
        await emailService.sendPasswordResetEmail(user.email, resetToken);
        // logger.info(`Password reset process initiated for user: ${user._id}`);

        return resetToken;
    } catch (error) {
        // logger.error(`Password reset error: ${error.message}`);
        throw new Error('Failed to process password reset');
    }
};

// Reset password with token
export const resetPassword = async (token, newPassword) => {
    try {
        // Hash the token from the URL
        const hashedToken = TokenFactory.hashToken(token);

        // Find user with the token using repository
        const user = await TokenRepository.findUserByResetToken(hashedToken);

        if (!user) {
            // logger.warn('Invalid or expired password reset token used');
            throw new Error('Invalid or expired token');
        }

        // Update password and clear reset token fields
        const hashedPassword = await hashingOperations.hashPassword(newPassword);
        user.password = hashedPassword;
        await user.save();
        await TokenRepository.clearResetToken(user._id);

        // logger.info(`Password reset successfully for user: ${user._id}`);
        return true;
    } catch (error) {
        // logger.error(`Password reset error: ${error.message}`);
        throw new Error(error.message || 'Failed to reset password');
    }
};

// sign up with different credentials
export const signUpWithGoogle = async (userData) => {
    // hash the password
    const hashedPassword = await hashingOperations.hashPassword(userData.password);

    // console.log("User data from Google from signUpWithGoogle Service:", userData);

    // getting the user data except password
    const { password, ...restUserData } = userData;

    // create a new user
    const newUser = new User({
        ...restUserData,
        password: hashedPassword
    });

    // save the user to the database
    await newUser.save();

    // return the user
    return newUser;
}