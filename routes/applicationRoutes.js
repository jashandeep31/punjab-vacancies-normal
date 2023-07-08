const router = require("express").Router();
const protectedRoutes = require("../utils/protectedRoutes");
const {
    create,
    userAll,
    jobSpecific,
    updateApplication,
} = require("../controllers/applicationController");
router.route("/apply/:slug").post(protectedRoutes(["any"]), create);
router.route("/my").get(protectedRoutes(["any"]), userAll);
router
    .route("/update/:id")
    .post(protectedRoutes(["manager"]), updateApplication);
router.route("/:slug").get(protectedRoutes(["manager"]), jobSpecific);
module.exports = router;
