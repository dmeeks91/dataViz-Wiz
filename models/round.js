const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const rounds = new Schema({
  playerid: { type: String, required: true },
  gameid: { type: String, required: true },
  index: { type: Number, required: true },
  guesses: {type: Array, required: true}
});

const Round = mongoose.model("Round", rounds);

module.exports = Round;