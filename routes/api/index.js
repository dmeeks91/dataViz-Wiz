const router = require("express").Router();
const gameRoutes = require("./game");

// Book routes
router.use("/", gameRoutes);

module.exports = router;
