const router = require("express").Router();
const gameController = require("../../controllers/gameController");

// Matches with "/api/user"
router.route("/user")
  .post(gameController.update);

router.route("/new-game")
  .post(gameController.newGame);

router.route("/save-round")
  .post(gameController.saveRound);

router.route("/get-rounds/:id")
  .get(gameController.getRounds);

router.route("/get-stats")
  .get(gameController.getStats);
  
router.route("/update-game")
  .post(gameController.updateGame);

router.route("/games/:id")
  .get(gameController.getGames);

module.exports = router;
