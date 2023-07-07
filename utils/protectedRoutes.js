const User = require("../models/userModel");
const AppError = require("./appError");

const protectedRoutes = (permissions) => {
    return async (req, res, next) => {
        if (!req.isAuthenticated()) {
            return next(new AppError("Unauthorized ", 401));
        }
        const user = await User.findOne({ userId: req.user.id });

        if (!permissions.includes("any") && !permissions.includes(user.role)) {
            return next(new AppError("Your are not allowed", 401));
        }
        req["userData"] = user;
        return next();
    };
};

module.exports = protectedRoutes;
