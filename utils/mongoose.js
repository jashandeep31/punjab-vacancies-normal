const mongoose = require("mongoose");
const URI = process.env.MONGOOSE_URI.replace(
    "<password>",
    process.env.MONGOOSE_PASS
);

mongoose
    .connect(URI)
    .then(() => {
        console.log("mongoose is connected");
    })
    .catch(() => {
        console.log("error in connecting");
    });
