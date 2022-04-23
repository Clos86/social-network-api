const router = require("express").Router();

const userApi = require("./users-routes");
const thoughtApi = require("./thoughts-routes");

router.use("/users", userApi);
router.use("/thoughts", thoughtApi);

module.exports = router;