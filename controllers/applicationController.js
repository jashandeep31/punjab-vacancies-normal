const Application = require("../models/applicationModel");
const Job = require("../models/jobModel");
const catchAsync = require("../utils/catchAsync");
const appError = require("../utils/appError");
const User = require("../models/userModel");

exports.create = catchAsync(async (req, res, next) => {
    const slug = req.params.slug;
    const job = await Job.findOne({
        slug: slug,
    });
    if (job.inbuiltForm !== true || job.active !== true) {
        return next(new appError("Sorry form can't be submitted", 501));
    }

    if (req.userData.applications.includes(job._id)) {
        return next(new appError("You have already applied for this job", 501));
    }

    const { name, phoneNumber, age, education, experience, address, about } =
        req.body;

    if (
        !name ||
        !phoneNumber ||
        !age ||
        !education ||
        !experience ||
        !address ||
        !about
    ) {
        return next(new appError("Fill the complete form", 401));
    }

    const application = await Application.create({
        name,
        phoneNumber,
        job: job._id,
        age,
        education,
        experience,
        address,
        about,
        filledBy: req.userData._id,
    });

    await User.findByIdAndUpdate(req.userData._id, {
        $push: { applications: job._id },
    });

    res.status(201).json({
        application,
    });
});

exports.userAll = catchAsync(async (req, res, next) => {
    const applications = await Application.find({
        filledBy: req.userData._id,
    })
        .populate("job")
        .sort({ createdAt: -1 });
    res.status(200).json({
        applications,
    });
});

exports.jobSpecific = catchAsync(async (req, res, next) => {
    const job = await Job.findOne({
        slug: req.params.slug,
    });
    if (!job) {
        return next(new appError("Job not found", 404));
    }

    if (job.inbuiltForm !== true) {
        return next(new appError("Job not found", 404));
    }
    if (job.createdBy.toString() !== req.userData._id.toString()) {
        return next(new appError("Job not found", 404));
    }
    const applications = await Application.find({
        job: job._id,
    }).populate("job");
    res.status(200).json({
        applications,
    });
});

exports.updateApplication = catchAsync(async (req, res, next) => {
    const application = await Application.findById(req.params.id);
    const job = await Job.findById(application.job);
    if (job.createdBy.toString() !== req.userData._id.toString()) {
        return next(new appError("Job not found", 404));
    }
    const { status } = req.body;
    if (!status) {
        return next(new appError("Fill the complete form", 401));
    }
    application.status = status;
    await application.save();
    res.status(200).json({
        application,
    });
});
