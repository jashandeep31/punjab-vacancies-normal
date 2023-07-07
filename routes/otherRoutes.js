const router = require("express").Router();
const { createDistrict } = require("../controllers/otherControllers");
router.route("/create").get(createDistrict);

module.exports = router;
