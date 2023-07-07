const express = require("express");
const port = process.env.PORT || 8000;
const passport = require("passport");
const cookiesSession = require("cookie-session");
const protectedRoutes = require("./utils/protectedRoutes");
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
// app.use(function (req, res, next) {
//     res.header(
//         "Access-Control-Allow-Origin",
//         "https://www.punjabvacancies.live"
//     ); // Update with your allowed origin(s)
//     res.header(
//         "Access-Control-Allow-Headers",
//         "Origin, X-Requested-With, Content-Type, Accept"
//     ); // Update with your allowed headers
//     res.header("Access-Control-Allow-Credentials", "true");
//     // Add other necessary headers
//     next();
// });

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

// app.use(
//     cookiesSession({
//         name: "session",
//         keys: ["googleAuths"],
//         maxAge: 10 * 24 * 60 * 60 * 1000, // cookies are stored for 10 days
//     })
// );
app.use(
    session({
        secret: "secretcode",
        resave: true,
        saveUninitialized: true,
        cookie: {
            maxAge: 1000 * 60 * 60 * 24 * 7, // One Week
            sameSite: "none",
            secure: true,
        },
    })
);

app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req, res, next) => {
    res.send("0.0.3");
});
app.use("/api/v1/auth", require("./routes/authRoutes")); // checked
app.use("/api/v1/job", require("./routes/jobRoutes"));
app.use("/api/v1/other", require("./routes/otherRoutes"));

app.use(require("./controllers/errorContollers"));
app.listen(port, () => {
    console.log("port is running");
});
