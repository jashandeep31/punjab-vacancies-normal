const User = require("../models/userModel");
const slugify = require("slugify");
const axios = require("axios");
const moment = require("moment");
const { District } = require("../models/otherModel");
const Job = require("../models/jobModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const indexingFunction = require("../utils/indexingFunction");

exports.directJob = catchAsync(async (req, res, next) => {
    const today = new Date();
    const extDeadline = new Date(today);
    extDeadline.setDate(today.getDate() + 7);

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

    if (!title) {
        return next(new AppError("Please provide a title", 400));
    }

    if (!organization) {
        organization = "Not specified";
    }

    if (!salary) {
        salary = "Not specified";
    }
    if (!experience) {
        experience = "Not specified";
    }

    if (!description) {
        return next(new AppError("Please provide a description", 400));
    }

    if (!interviewDetails) {
        interviewDetails = description;
    }

    if (!deadline) {
        deadline = extDeadline;
        // return next(new AppError("Please provide a deadline", 400));
    }

    if (!district) {
        return next(new AppError("Please provide a district", 400));
    }

    if (!education) {
        education = "Not specified";
    }

    const districtId = await District.findOne({
        slug: slugify(district, { trim: true, lower: true }),
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

    const job = await Job.create({
        title,
        organization,
        salary,
        jobSector: "private",
        jobType: "Full Time",
        experience,
        description,
        interviewDetails,
        deadline: today > new Date(deadline) ? extDeadline : new Date(deadline),
        slug,
        education,
        createdBy: "64a25cda6806cb3a8df60fe3",
        applyNowLink,
        district: districtId._id,
        inbuiltForm,
        active: true,
        activeGoogleCard: true,
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
<a href="https://www.jobs.jashandeep.me/job/${job.slug}">Click here</a>
`,
                parse_mode: "HTML",
            },
        }
    );

    indexingFunction(
        `https://jobs.jashandeep.me/job/${job.slug}`,
        "URL_UPDATED"
    );
    return res.status(201).json({
        job,
    });
});
