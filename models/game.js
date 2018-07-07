const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const games = new Schema({
  closed: { type: Boolean, default: false},
  win: { type: String},
  lose: { type: String},
  type: {type: Number, default: 0},
  option: {type: Number, default: 0},
  rounds: [
    {
      type: Schema.Types.ObjectId,
      ref: "round"
    }
  ]
});

const Game = mongoose.model("Game", games);

module.exports = Game;
