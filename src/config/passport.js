import passport from "passport";
import User from "../DB/models/user.js";
import * as authServices from "../services/auth.js";
import dotenv from "dotenv";
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
    callbackURL: "/api/v1/auth/google/callback",
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
                password: process.env.GOOGLE_PASSWORD, // static password for google users
                profile_picture: profile.photos[0]?.value || null,
            };
            user = await authServices.signUpWithGoogle(userData);
        }

        return done(null, user);
    } catch (err) {
        return done(err, null);
    }
};

// Create and register the Google Strategy
const googleStrategy = new OAuthStrategy(GoogleStrategy, googleOptions, googleVerify);
googleStrategy.register();

// ========= Common Serialize / Deserialize =========
passport.serializeUser((user, done) => done(null, user.id));

passport.deserializeUser(async (id, done) => {
    const user = await User.findById(id);
    done(null, user);
});

// ========= Export Passport =========
export default passport;
