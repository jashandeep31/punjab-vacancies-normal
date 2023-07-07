const mongoose = require("mongoose");
const jobSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    slug: {
        type: String,
        unique: true,
        required: true,
    },
    organization: {
        type: String,
        required: true,
    },
    salary: {
        type: String,
        required: true,
    },
    jobSector: {
        type: String,
        enum: ["private", "government"],
        required: true,
    },
    jobType: {
        type: String,
        enum: ["Full Time", "Part Time", "Freelancing", "Internship"],
        required: true,
    },
    experience: {
        type: String,
        required: true,
    },
    education: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },

    interviewDetails: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },

    deadline: {
        type: Date,
        required: true,
    },
    district: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "District",
        required: true,
    },
    active: {
        type: Boolean,
        default: true,
    },
    applyNowLink: {
        type: String,
    },
});

const Job = mongoose.model("Job", jobSchema);

module.exports = Job;
