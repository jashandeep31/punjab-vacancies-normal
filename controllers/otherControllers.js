const { District } = require("../models/otherModel");
const catchAsync = require("../utils/catchAsync");
const appError = require("../utils/appError");

exports.createDistrict = catchAsync(async (req, res, next) => {
    res.send(201).json({});
});
