const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const rounds = new Schema({
  playerid: { type: String, required: true },
  gameid: { type: String, required: true },
  sequence: { type: Number, required: true },
  correct: { type: String, required: true },
  guess: {type: String, required: true}
});

const Round = mongoose.model("Round", rounds);

module.exports = Round;