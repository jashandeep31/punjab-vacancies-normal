const express = require("express");
const port = process.env.PORT || 8000;
const passport = require("passport");
const session = require("express-session");
const cors = require("cors");
require("dotenv").config("");
require("./utils/passport");
require("./utils/mongoose");
const app = express();

var allowedOrigins = [
    "https://www.punjabvacancies.live",
    "http://www.punjabvacancies.live",
    "https://punjabvacancies.live",
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

app.set("trust proxy", 1);

app.use(
    session({
        secret: "xvs-ev*DjzgVfNzuYNgXth-zhRpr_KNvnecZ-c2KMgzj8i3@BZD9@y6!fee!ejvQPM37e_r-qZ8_N!QowKEzuWmrd6@8-JxPmow3",
        resave: true,
        saveUninitialized: true,
        cookie: {
            maxAge: 1000 * 60 * 60 * 24 * 7, // One Week
        },
    })
);

app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req, res, next) => {
    res.send("0.0.88");
});
app.use("/api/v1/auth", require("./routes/authRoutes")); // checked
app.use("/api/v1/job", require("./routes/jobRoutes"));
app.use("/api/v1/other", require("./routes/otherRoutes"));

app.use(require("./controllers/errorContollers"));
app.listen(port, () => {
    console.log("port is running");
});
