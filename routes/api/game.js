const router = require("express").Router();
const gameController = require("../../controllers/gameController");

// Matches with "/api/user"
router.route("/user")
  .post(gameController.update);
router.route("/newgame")
  .post(gameController.newGame);



module.exports = router;
