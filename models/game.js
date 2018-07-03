const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const games = new Schema({
  closed: { type: Boolean, default: false },
  win: { type: String},
  lose: { type: String},
  rounds: {type: Array}
});

const Game = mongoose.model("Game", games);

module.exports = Game;
