const mongoose = require("mongoose");
const Job = require("./jobModel");
const userSchema = new mongoose.Schema({
    userId: {
        type: String,
        unique: true,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: ["please enter the name", true],
    },
    active: {
        type: Boolean,
        default: true,
    },
    role: {
        type: String,
        enum: ["user", "manager", "admin"],
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    applications: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Job",
        },
    ],
    requested: {
        type: Boolean,
        default: false,
    },
    phoneNumber: {
        type: String,
    },
});

const User = mongoose.model("User", userSchema);
module.exports = User;
