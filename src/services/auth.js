import User from "../DB/models/user.js";
import { createCustomError } from "../middlewares/errors/customError.js";
import * as hashingOperations from "../utils/bcrypt.js";
import * as tokenOperations from "../utils/jwt.js";

export const signUpUser = async (userData, req) => {
    // destructuring the userData object
    const { username, email, password } = userData;

    // check if the email already exists
    const foundUser = await User.findOne({
        email,
    });

    if (foundUser) {
        throw createCustomError("User already exists", 400, null);
    }

    // hash the password
    const hashedPassword = await hashingOperations.hashPassword(password);

    // create one-use token and should immediately get revoked after use
    const emailVerificationToken = tokenOperations.generateToken({
        email,
    });

    // create a new user
    const newUser = new User({
        username,
        email,
        password: hashedPassword,
        emailVerificationToken
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
        throw createCustomError("User does not exist", 400);
    }

    // check if the password is correct
    const isPasswordCorrect = await hashingOperations.comparePassword(
        password,
        foundUser.password
    );

    if (!isPasswordCorrect) {
        throw createCustomError("Invalid credentials", 400);
    }

    // check if the email is verified
    if (!foundUser.emailVerified) {
        throw createCustomError("Email not verified", 400);
    }

    // generate a token
    const token = tokenOperations.generateToken({
        id: foundUser._id,
        email: foundUser.email,
    });

    return { token };
};
