const mongoose = require("mongoose");

const districtSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    slug: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const District = mongoose.model("District", districtSchema);

module.exports = { District };
