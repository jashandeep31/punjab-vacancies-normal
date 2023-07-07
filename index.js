const express = require("express");
const port = process.env.PORT || 8000;
const passport = require("passport");
const cookiesSession = require("cookie-session");
const protectedRoutes = require("./utils/protectedRoutes");
const cors = require("cors");
require("dotenv").config("");
require("./utils/passport");
require("./utils/mongoose");
const app = express();

var allowedOrigins = ["http://localhost:3000", process.env.FRONTEND];

app.use(express.json());
app.use(
    cors({
        origin: function (origin, callback) {
            // allow requests with no origin
            // (like mobile apps or curl requests)
            if (!origin) return callback(null, true);
            if (allowedOrigins.indexOf(origin) === -1) {
                var msg =
                    "The CORS policy for this site does not " +
                    "allow access from the specified Origin.";
                return callback(new Error(msg), false);
            }
            return callback(null, true);
        },
        optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
        credentials: true,
    })
);

app.use(
    cookiesSession({
        name: "session",
        keys: ["googleAuth"],
        maxAge: 10 * 24 * 60 * 60 * 1000, // cookies are stored for 10 days
    })
);
app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req, res, next) => {
    res.send("0.0.1");
});
app.use("/api/v1/auth", require("./routes/authRoutes")); // checked
app.use("/api/v1/job", require("./routes/jobRoutes"));
app.use("/api/v1/other", require("./routes/otherRoutes"));

app.use(require("./controllers/errorContollers"));
app.listen(port, () => {
    console.log("port is running");
});
