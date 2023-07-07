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
    }).select("name role ");
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
        successRedirect: "http://localhost:8000/api/v1/auth/",
        failureRedirect: "http://localhost:8000/api/v1/auth/fail",
    })
);

module.exports = router;
