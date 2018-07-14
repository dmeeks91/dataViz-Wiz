const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const games = new Schema({
  closed: { type: Boolean, default: false},
  lose: { type: String},
  option: {type: Number, default: 0},
  players: [],
  rounds: [
    {
      type: Schema.Types.ObjectId,
      ref: "Round"
    }
  ],
  type: {type: Number, default: 0},
  win: { type: String},
});

const Game = mongoose.model("Game", games);

module.exports = Game;
