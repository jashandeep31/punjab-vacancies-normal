const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema({
    job: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Job",
    },
    name: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: String,
        required: true,
    },
    education: {
        type: String,
        required: true,
    },
    age: {
        type: String,
        required: true,
    },
    experience: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    about: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ["shortlisted", "archived", "normal"],
        default: "normal",
    },
    filledBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Application = mongoose.model("Application", applicationSchema);

module.exports = Application;
