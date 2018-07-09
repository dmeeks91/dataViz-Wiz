const db = require("../models");

// Defining methods for the booksController
module.exports = {
  findAll: (req, res) => {
    db.Player
      .find(req.query)
      .sort({ date: -1 })
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },

  newGame: (req, res) => {
    db.Game
      .create({closed: false})
      .then(dbModel => {
      res.json(dbModel)})
      .catch(err => res.status(422).json(err));
  },

  saveRound:(req, res) => {
    const {playerID, gameID, index} = req.body;
    db.Round
      //.findOneAndUpdate({ playerID, gameID, index }, req.body)//, {upsert: true}
      .findOne({ playerID, gameID, index })
      .then(round => {      
        if (!round) {
          db.Round.create(req.body)
            .then(round => {
              return db.Game.findByIdAndUpdate(gameID, 
                { $push:{ rounds: round._id } },
                { new: true }
              );
            })
        }
      })
      .then(data => res.json(data))
      .catch(err => res.status(422).json(err));
  },

  update: (req, res) => {
    db.Player
      .findOneAndUpdate({ gID: req.body.gID }, req.body, {upsert: true, returnNewDocument: true})
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },

  getStats: (req, res) => {
    db.Round
      console.log("running")
      .findOneAndUpdate({ playerID: req.body.playerID },)
  },
  
  getGames: (req, res) => {
    console.log(req.params.id);
    db.Game.find({win: req.params.id})
      .populate('rounds')
      .then(games => {
        res.json(games);
      })
      .catch(err => res.json(err));
  },

  updateGame: (req, res) => {
    const {id, win, lose} = req.body;
    db.Game
      .findOneAndUpdate({_id:id}, {win, lose}, {upsert:false})
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  }
};
