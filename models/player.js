const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const players = new Schema({
  googleID: { type: String, required: true }
});

const Player = mongoose.model("Player", players);

module.exports = Player;