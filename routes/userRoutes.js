const User = require("../models/userModel");
const router = require("express").Router();
const protectedRoutes = require("../utils/protectedRoutes");
const appError = require("../utils/appError");
router
    .route("/become-manager")
    .post(protectedRoutes(["any"]), async (req, res, next) => {
        const { phoneNumber } = req.body;
        if (!phoneNumber || phoneNumber.length !== 10) {
            return next(new appError("Fill the complete form", 501));
        }
        const user = await User.findByIdAndUpdate(req.userData._id, {
            requested: true,
            phoneNumber,
            role: "manager",
        });
        return res.status(200).json({});
    });

module.exports = router;
