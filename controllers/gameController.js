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

  getRounds: (req, res) => {
    db.Round.find({playerID: req.params.id})
      .then(rounds => {
        res.json(rounds);
      })
      .catch(err => res.json(err));
  },  

  getSingleRecords: (req, res) => {

  },
  
  getStats: (req, res) => {
    db.Round
      console.log("running")
      .findOneAndUpdate({ playerID: req.body.playerID },)
  },
  
  getGames: (req, res) => { 
    // get games where at least one guess has been made
    const query = (req.params.id != "all") ? {"players.id" : req.params.id, $where:"this.rounds.length > 0"} 
    : {$where:"this.rounds.length > 0"};

      db.Game.find(query)
      .populate('rounds')
      .then(games => {
        // console.log(games.length);
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

//Code used to fix issue with Ronnies ghost ID
// db.Game.update(
//   {},
//   {$set:{"players.$[el].id":"5b587d1ca15d10553034f85f"}},
//   {
//       multi:true,
//       arrayFilters:[{"el.name":{$eq:"Ronnie"}}]
//   }
// )
// db.Round.update(
//   {"playerID":"5b4c004979453060c1d19ab9"},
//   {$set:{"playerID":"5b587d1ca15d10553034f85f"}},
//   {multi:true})