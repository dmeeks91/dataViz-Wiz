const db = require("../models");

const io = {
    connect: (client) => {
        client.on('joinGame', (playerID) => {
            io.findOpenGame(playerID)
              .then(game =>{
                console.log(`new client joined, playerID: ${playerID}`);
                console.log(game);
                client.emit('joined', {msg:"congrats game entered", data: game});
              });
            
            //client.emit('joined', "congrats game entered");
        });
    },
    findOpenGame: (playerID) => {
       return new Promise((resolve, reject) => {
           db.Game.find({closed:false, type:1, $where:"this.players.length < 3"})
                .then(games => {
                    console.log(games);
                    if (games.length === 1)
                    {
                        const { _id, players } = games[0];
                        if (players.indexOf(playerID) === -1)
                        {
                            db.Game.findByIdAndUpdate(_id,
                            { $push:{ players: playerID }, closed: true }, 
                            { new: true })
                            .then(data => resolve(data))
                            .catch(err => reject(err));
                        }
                    }
                    else
                    {
                        db.Game.create({closed: false, type:1, players:[playerID]})
                        .then(newGame => resolve(newGame))
                        .catch(err => reject(err));
                    }
                });
        });
    },

}

module.exports = {
    io
}
