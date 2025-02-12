import User from "../DB/models/user.js";
import { createCustomError } from "../middlewares/errors/customError.js";
import * as hashingOperations from "../utils/bcrypt.js";
import * as tokenOperations from "../utils/jwt.js";

export const signUpUser = async (userData) => {
    // destructuring the userData object
    const { username, email, password, confirm_password } = userData;

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
