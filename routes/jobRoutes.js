const { directJob } = require("../controllers/directJobController");
const {
    createJob,
    getAll,
    getJob,
    getUserSpecific,
} = require("../controllers/jobControllers");
const protectedRoutes = require("../utils/protectedRoutes");
const router = require("express").Router();

router.route("/create").post(protectedRoutes(["manager", "admin"]), createJob);
router.route("/direct").post(directJob);
router.route("/all").get(getAll);
router
    .route("/manager-jobs")
    .get(protectedRoutes(["manager", "admin"]), getUserSpecific);

// add this to  the end
router.route("/:slug").get(getJob);

module.exports = router;
