const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const rounds = new Schema({
  playerID: { type: String, required: true },
  gameID: { type: String, required: true },
  index: { type: Number, required: true },
  guesses: {type: Array, required: true}
});

const Round = mongoose.model("Round", rounds);

module.exports = Round;