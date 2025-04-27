import passport from "passport";
import User from "../DB/models/user.js";
import * as authServices from "../services/auth.js";
import dotenv from "dotenv";
import axios from "axios";
dotenv.config();

// ========= Strategy Base Class =========
class OAuthStrategy {
    constructor(strategy, options, verifyCallback) {
        this.strategy = strategy;
        this.options = options;
        this.verifyCallback = verifyCallback;
    }

    register() {
        passport.use(new this.strategy(this.options, this.verifyCallback));
    }
}

// ========= Google Strategy =========
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

const googleOptions = {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL
};

const googleVerify = async (accessToken, refreshToken, profile, done) => {
    try {
        const email = profile.emails[0].value;
        let user = await User.findOne({ email });

        if (!user) {

            const userData = {
                username: profile.displayName,
                email: email,
                country: "Not provided", // default value
                job: "Not provided", // default value
                password: process.env.GOOGLE_PASSWORD, // static password for Google users
                profile_picture: profile.photos[0]?.value || null,
            };

            console.log("User data from Google:", userData);

            user = await authServices.signUpWithOAuthProvider(userData);
        }

        return done(null, user);
    } catch (err) {
        return done(err, null);
    }
};

// Create and register the Google Strategy
const googleStrategy = new OAuthStrategy(GoogleStrategy, googleOptions, googleVerify);
googleStrategy.register();

// ========= GitHub Strategy =========
import { Strategy as GitHubStrategy } from "passport-github2";

const githubOptions = {
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.GITHUB_CALLBACK_URL
};

const githubVerify = async (accessToken, refreshToken, profile, done) => {
    try {

        // Fetch the user's email from GitHub API using the access token of the user
        const response = await axios.get("https://api.github.com/user/emails", {
            headers: {
                Authorization: `Bearer ${accessToken}`
            },
        });

        // Check if the response contains the email
        let emails = response.data;
        let email = (emails.find((e) => (e.primary && e.verified) || (!e.primary && e.verified))).email;

        // console.log("User email from GitHub:", email);

        // If no email is found, return an error
        if (!email) {
            return done(new Error("No email associated with this account"), null);
        }

        // Check if the user already exists in the database
        let user = await User.findOne({ email });

        // If the user does not exist, create a new user
        if (!user) {
            const userData = {
                username: profile.username || profile.displayName || "GitHub User",
                email: email,
                country: "Not provided",
                job: "Not provided",
                password: process.env.GITHUB_PASSWORD,
                profile_picture: profile.photos?.[0]?.value || null,
            };
            user = await authServices.signUpWithOAuthProvider(userData);
        }

        return done(null, user);
    } catch (error) {
        return done(error, null);
    }
};

// Create and register the GitHub Strategy
const githubStrategy = new OAuthStrategy(GitHubStrategy, githubOptions, githubVerify);
githubStrategy.register();

// ========= Facebook Strategy =========
import { Strategy as FacebookStrategy } from "passport-facebook";

const facebookOptions = {
    clientID: process.env.FACEBOOK_CLIENT_ID,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    callbackURL: process.env.FACEBOOK_CALLBACK_URL
};

const facebookVerify = async (accessToken, refreshToken, profile, done) => {
    try {
        let email = profile.emails?.[0]?.value;

        // If email is not available in profile, fetch it manually
        if (!email) {
            const { data } = await axios.get(`https://graph.facebook.com/${profile.id}`, {
                params: {
                    fields: 'id,name,email',
                    access_token: accessToken
                }
            });
            email = data.email;
        }

        if (!email) {
            return done(new Error("Email is required but not provided by Facebook"), null);
        }

        let user = await User.findOne({ email });

        if (!user) {

            const userData = {
                username: profile.displayName || profile.username || "Facebook User",
                email: email,
                country: "Not provided",
                job: "Not provided",
                password: process.env.FACEBOOK_PASSWORD, // static password
                profile_picture: profile.photos?.[0]?.value || null,
            };

            user = await authServices.signUpWithOAuthProvider(userData);
        }

        return done(null, user);
    } catch (error) {
        return done(error, null);
    }
};

// Create and register the Facebook Strategy
const facebookStrategy = new OAuthStrategy(FacebookStrategy, facebookOptions, facebookVerify);
facebookStrategy.register();

// ========= Common Serialize / Deserialize =========
passport.serializeUser((user, done) => done(null, user.id));

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

// ========= Export Passport =========
export default passport;
