const express = require("express");
const passport = require("passport");
const session = require("express-session");
const cors = require("cors");

require("dotenv").config("");
const port = process.env.PORT || 8000;
require("./utils/passport");
require("./utils/mongoose");
const app = express();

var allowedOrigins = [
    "https://jobs.jashandeep.me",
    "https://www.jobs.jashandeep.me",
    "http://localhost:3000",
];

app.use(express.json());

app.use(
    cors({
        origin: function (origin, callback) {
            if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
                callback(null, true);
            } else {
                callback(new Error("Not allowed by CORS"));
            }
        },
        optionsSuccessStatus: 200,
        credentials: true,
    })
);

app.use(
    session({
        secret: "xvs-ev*DjzgVfNzuYNgXth-zhRpr_KNvnecZ-c2KMgzj8i3@BZD9@y6!fee!ejvQPM37e_r-qZ8_N!QowKEzuWmrd6@8-JxPmow3",
        resave: true,
        saveUninitialized: true,
        cookie: {
            maxAge: 1000 * 60 * 60 * 24 * 20, // One Week
        },
    })
);

app.use(passport.initialize());
app.use(passport.session());

app.get("/", async (req, res, next) => {
    res.send("0.0.88");
});
app.use("/api/v1/auth", require("./routes/authRoutes")); // checked
app.use("/api/v1/job", require("./routes/jobRoutes"));
app.use("/api/v1/other", require("./routes/otherRoutes"));
app.use("/api/v1/application", require("./routes/applicationRoutes"));
app.use("/api/v1/user", require("./routes/userRoutes"));

app.use(require("./controllers/errorContollers"));
app.listen(port, () => {
    console.log("port is running");
});
