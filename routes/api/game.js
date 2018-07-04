const router = require("express").Router();
const gameController = require("../../controllers/gameController");

// Matches with "/api/user"
router.route("/user")
  .post(gameController.update);
router.route("/new-game")
  .post(gameController.newGame);
router.route("/save-round")
  .post(gameController.saveRound);


module.exports = router;
