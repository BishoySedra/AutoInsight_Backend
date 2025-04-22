import passport from "passport";
import GoogleStrategy from "passport-google-oauth20";
import User from "../DB/models/user.js";
import * as authServices from "../services/auth.js";

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: "/api/v1/auth/google/callback",
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                const email = profile.emails[0].value;

                let user = await User.findOne({ email });

                if (!user) {
                    const userData = {
                        username: profile.displayName,
                        email: email,
                        password: process.env.GOOGLE_PASSWORD,
                        profile_picture: profile.photos[0]?.value || null,
                    }
                    user = await authServices.signUpWithGoogle(userData);
                }

                return done(null, user);
            } catch (err) {
                return done(err, null);
            }
        }
    )
);

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
    const user = await User.findById(id);
    done(null, user);
});

export default passport;