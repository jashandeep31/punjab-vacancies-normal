const Job = require("../models/jobModel");
const User = require("../models/userModel");
const slugify = require("slugify");
const axios = require("axios");
const moment = require("moment");
const Filters = require("../utils/Filters");
const { District } = require("../models/otherModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const indexingFunction = require("../utils/indexingFunction");

exports.createJob = catchAsync(async (req, res, next) => {
    let {
        title,
        organization,
        salary,
        jobSector,
        jobType,
        experience,
        description,
        interviewDetails,
        deadline,
        education,
        applyNowLink,
        district,
        inbuiltForm,
        activeGoogleCard,
        streetAddress,
        addressLocality,
        addressRegion,
        postalCode,
        addressCountry,
        minValue,
        maxValue,
        unitText,
        isBoth,
        value,
        OrgName,
        logo,
        website,
    } = req.body;

    // if (
    //     !title ||
    //     !organization ||
    //     !salary ||
    //     !jobSector ||
    //     !jobType ||
    //     !experience ||
    //     !description ||
    //     !interviewDetails ||
    //     !deadline ||
    //     !district ||
    //     !education
    // ) {
    //     return next(new AppError("Please fill all the fields", 400));
    // }
    if (!title) {
        return next(new AppError("Please provide a title", 400));
    }

    if (!organization) {
        return next(new AppError("Please provide an organization", 400));
    }

    if (!salary) {
        return next(new AppError("Please provide a salary", 400));
    }

    if (!jobSector) {
        return next(new AppError("Please provide a job sector", 400));
    }

    if (!jobType) {
        return next(new AppError("Please provide a job type", 400));
    }

    if (!experience) {
        return next(new AppError("Please provide experience details", 400));
    }

    if (!description) {
        return next(new AppError("Please provide a description", 400));
    }

    if (!interviewDetails) {
        return next(new AppError("Please provide interview details", 400));
    }

    if (!deadline) {
        return next(new AppError("Please provide a deadline", 400));
    }

    if (!district) {
        return next(new AppError("Please provide a district", 400));
    }

    if (!education) {
        return next(new AppError("Please provide education details", 400));
    }

    const districtId = await District.findOne({
        slug: district,
    });

    if (!districtId) {
        return next(new AppError("Something went wrong", 500));
    }

    const date = moment().format("L").replaceAll("/", "-");
    let slug = slugify(title + "-" + organization + date, {
        lower: true,
    });
    const jobTest = await Job.findOne({
        slug: slug,
    });

    if (jobTest) {
        function generateRandom() {
            var digits = "34dsf943d0";
            let OTP = "";
            for (let i = 0; i < 4; i++) {
                OTP += digits[Math.floor(Math.random() * 10)];
            }
            return OTP;
        }
        slug = slug + generateRandom();
    }
    let active = false;
    if (req.userData.role === "admin") {
        active = true;
        activeGoogleCard = req.body.activeGoogleCard;
    } else {
        active = false;
        activeGoogleCard = false;
    }
    const job = await Job.create({
        title,
        organization,
        salary,
        jobSector,
        jobType,
        experience,
        description,
        interviewDetails,
        deadline: new Date(deadline),
        slug,
        education,
        createdBy: req.userData.id,
        applyNowLink,
        district: districtId._id,
        inbuiltForm,
        active: active,
        activeGoogleCard,
        gorganization: {
            typeOf: "Organization",
            name: OrgName,
            logo,
            website,
        },
        jobLocation: {
            type: "Place",
            address: {
                type: "PostalAddress",
                streetAddress,
                addressLocality,
                addressRegion,
                postalCode,
                addressCountry,
            },
        },
        baseSalary: {
            type: "MonetaryAmount",
            value: {
                typeof: "QuantitativeValueDistribution",
                minValue,
                maxValue,
                unitText,
                isBoth,
                value,
            },
        },
    });

    await axios.get(
        `https://api.telegram.org/bot5807756495:AAFG13m3ZeIddWVGAAGtdalmkUCj87_iYsQ/sendMessage?chat_id=-1001957750958&`,
        {
            params: {
                text: `Job Update 👇
Organization: ${job.organization}

Profile: ${job.title}
Education: ${job.education}
Experience: ${job.experience}
Salary: ${job.salary}
Location: ${districtId.name}

Know More:
<a href="https://www.punjabvacancies.live/job/${job.slug}">Click here</a>
`,
                parse_mode: "HTML",
            },
        }
    );

    indexingFunction(
        `https://punjabvacancies.live/job/${job.slug}`,
        "URL_UPDATED"
    );

    res.status(201).json({
        job,
    });
});

exports.getAll = catchAsync(async (req, res, next) => {
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 10;
    let district = "all";
    if (req.query.district) {
        district = await District.findOne({
            slug: req.query.district,
        });
        if (!district) {
            return next(new AppError("Sorry! This page doesn't exist", 404));
        }
    }
    const aggregateStages = [
        {
            $lookup: {
                from: "districts",
                localField: "district",
                foreignField: "_id",
                as: "district",
            },
        },
    ];
    if (req.query.district) {
        aggregateStages.push({
            $match: {
                "district.slug": req.query.district,
            },
        });
    }
    aggregateStages.push(
        {
            $sort: {
                createdAt: -1,
            },
        },
        {
            $unwind: "$district",
        },
        {
            $facet: {
                metadata: [
                    { $count: "total" },
                    {
                        $addFields: {
                            page: page,
                            isNext: {
                                $cond: {
                                    if: { $gt: ["$total", limit * page] },
                                    then: true,
                                    else: false,
                                },
                            },
                            isPrev: {
                                $cond: {
                                    if: { $gt: [page, 1] },
                                    then: true,
                                    else: false,
                                },
                            },
                            district: district,
                        },
                    },
                ],
                data: [{ $skip: (page - 1) * limit }, { $limit: limit }],
            },
        }
    );

    const jobs = await Job.aggregate(aggregateStages);
    if (jobs[0].metadata.length === 0) {
        jobs[0].metadata = [
            {
                total: 0,
                page: 1,
                isNext: false,
                isPrev: false,
                district: district,
            },
        ];
    }
    res.status(200).json({
        data: {
            jobs: jobs[0],
        },
    });
});

exports.getJob = async (req, res, next) => {
    const job = await Job.findOne({
        slug: req.params.slug,
    }).populate("district");
    if (!job) {
        // send the error
    }
    return res.status(200).json({
        job,
    });
};

exports.getUserSpecific = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.userData.id);
    const jobs = await Job.find({
        createdBy: user._id,
    }).sort({ createdAt: -1 });

    return res.status(200).json({
        jobs,
    });
});
