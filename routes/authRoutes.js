const router = require("express").Router();
const passport = require("passport");
const User = require("../models/userModel");
const AppError = require("../utils/appError");
router.get("/", async (req, res, next) => {
    if (!req.isAuthenticated()) {
        return next(new AppError("Not authenticated", 401));
    }
    const user = await User.findOne({
        userId: req.user.id,
    }).select("name role applications requested");
    if (!user) {
        return next(new AppError("Not authenticated", 401));
    }
    return res.status(200).json({
        status: true,
        user: user,
    });
});

router.get("/logout", async (req, res) => {
    req.logout();
    return res.status(200).json({
        status: "success",
        data: { status: false },
    });
});

router.get(
    "/google/callback",
    passport.authenticate("google", {
        successRedirect: process.env.FRONTEND,
        failureRedirect: process.env.FRONTEND,
    })
);

module.exports = router;
