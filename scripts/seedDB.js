const mongoose = require("mongoose");
const db = require("../models");
mongoose.Promise = global.Promise;

// This file empties the Books collection and inserts the books below

mongoose.connect(
  process.env.MONGODB_URI || "mongodb://localhost/vizwiz",
  {
    useMongoClient: true
  }
);

const playerSeed = [
  {
    googleid: "123456",
  },
];

const gameSeed = [
  {
    closed: false,
    win: "winning player id",
    lose: "losing player id",
    rounds: [1]
  },
];

const roundSeed = [
  {
    playerid: "a player id",
    gameid: "the game id",
    sequence: "losing player id",
    correct: "correct symbol",
    guess: "symbol guessed",

  },
];

db.Player
  .remove({})
  .then(() => db.Player.collection.insertMany(playerSeed))
      .then(db.Game.remove({}))
        .then(() => db.Game.collection.insertMany(gameSeed))
          .then(db.Round.remove({}))
            .then(() => db.Round.collection.insertMany(roundSeed))
              .then(data => {
                process.exit(0);
              })
              .catch(err => {
                console.error(err);
              process.exit(1);
              });




