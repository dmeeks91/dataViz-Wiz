const db = require("../models");

// Defining methods for the booksController
module.exports = {
  findAll: function(req, res) {
    db.Player
      .find(req.query)
      .sort({ date: -1 })
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },
  findById: function(req, res) {
    db.Book
      .findById(req.params.id)
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },

  newGame: function(req, res) {
    db.Game
      .create({closed: false})
      .then(dbModel => {
      res.json(dbModel)})
      .catch(err => res.status(422).json(err));
  },

  saveRound:function(req, res) {
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

  update: function(req, res) {
    console.log(req.params)
    db.Player
      .findOneAndUpdate({ gID: req.body.gID }, req.body, {upsert: true, returnNewDocument: true})
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },

  getGames: function(req, res) {
    console.log(req.params.id);
    db.Game.find({win: req.params.id})
      .populate('rounds')
      .then(games => {
        res.json(games);
      })
      .catch(err => res.json(err));
  },

  remove: function(req, res) {
    db.Book
      .findById({ _id: req.params.id })
      .then(dbModel => dbModel.remove())
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },

  updateGame: (req, res) => {
    const {id, win, lose} = req.body;
    db.Game
      .findOneAndUpdate({_id:id}, {win, lose}, {upsert:false})
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  }
};
