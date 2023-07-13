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
    inbuiltForm: {
        type: Boolean,
        default: false,
    },
    active: {
        type: Boolean,
        default: true,
    },
    applyNowLink: {
        type: String,
    },
    activeGoogleCard: {
        type: Boolean,
        default: false,
    },
    gorganization: {
        typeOf: {
            type: String,
        },
        name: {
            type: String,
        },
        logo: {
            type: String,
        },
        website: {
            type: String,
        },
    },
    jobLocation: {
        typeOf: {
            type: String,
        },
        address: {
            typeOf: {
                type: String,
            },
            streetAddress: {
                type: String,
            },
            addressLocality: {
                type: String,
            },
            addressRegion: {
                type: String,
            },
            postalCode: {
                type: String,
            },
            addressCountry: {
                type: String,
            },
        },
    },
    baseSalary: {
        typeOf: {
            type: String,
        },
        value: {
            typeof: {
                type: String,
            },
            minValue: {
                type: Number,
            },
            maxValue: {
                type: Number,
            },
            unitText: {
                type: String,
            },
            isBoth: {
                type: Boolean,

                default: false,
            },
            value: {
                type: Number,
            },
        },
    },
});

const Job = mongoose.model("Job", jobSchema);

module.exports = Job;
