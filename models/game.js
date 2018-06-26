const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const games = new Schema({
  closed: { type: Boolean, required: true },
  win: { type: String, required: true },
  lose: { type: String, required: true },
  rounds: {type: Array}
});

const Game = mongoose.model("Game", games);

module.exports = Game;
