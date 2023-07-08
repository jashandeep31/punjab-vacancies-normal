const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/userModel");
passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.BACKEND + "api/v1/auth/google/callback",
            scope: ["email", "profile"],
        },
        async function (accessToken, refreshToken, profile, cb) {
            const user = await User.findOne({
                email: profile._json.email,
            });
            if (!user) {
                const newUser = await User.create({
                    userId: profile.id,
                    name: profile._json.name,
                    email: profile._json.email,
                    role: "user",
                    active: true,
                });
                return cb(null, profile);
            }
            return cb(null, profile);
        }
    )
);

passport.serializeUser((user, callback) => {
    callback(null, user);
});

passport.deserializeUser((user, callback) => {
    callback(null, user);
});
