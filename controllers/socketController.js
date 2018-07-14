const db = require("../models");

const io = {
    connect: (client, server) => {
        client.on('joinGame', (game) => {
            //console.log("Joining Game");
            //console.log(game);
            if (game.type === 0)
            {
                db.Game.create(
                {
                    closed: true, 
                    option: game.option, 
                    players:[{id: game.playerID, name: game.playerName}], 
                    type: game.type
                }).then(game => {
                    client.join(game._id);
                    client.emit('joined', game);
                });  //need to handle starting the game when single player game

            }
            else
            {
                io.findOpenGame(game)
                    .then(game => {
                        client.join(game._id);
                        client.emit('joined', game);
                    });   
            }
        });
        client.on('startGame', (game) => {
            if (game.type === 0 || game.players.length === 2)
            {                
                setTimeout(() => {
                    server.to(game._id).emit('gameStarted', game);
                }, 1500); 
            }
        });
        client.on('endRound', (game) => {
            if (game.type === 0)
            {

            }
            else
            {

            }
        });
        client.on('getStats', (game) => {
            if (game.type === 0)
            {
                io.getGameStats(game._id)
                  .then(data => {
                      client.emit('stats',data[0]);
                  });
            }
            else
            {

            }
        });
    },
    findOpenGame: ({ option, playerID, playerName, type }) => {
       return new Promise((resolve, reject) => {           
           db.Game.find({closed:false, type, $where:"this.players.length < 3"})
                .then(games => {
                    if (games.length === 1)
                    {
                        const { _id, players } = games[0];
                        //if (players.indexOf(playerID) === -1)
                        if(!players.filter(player => player.id === _id).length)
                        {
                            db.Game.findByIdAndUpdate(_id,
                            { $push:{ players: {id: playerID, name: playerName}}, closed: true }, 
                            { new: true })
                            .then(data => resolve(data))
                            .catch(err => reject(err));
                        }
                        else
                        {
                            resolve(games[0]);
                        }
                    }
                    else if (!games.length)
                    {
                        //console.log('Creating Game');
                        db.Game.create({closed: false, 
                            option, 
                            players:[{id: playerID, name: playerName}], 
                            type
                        })
                        .then(newGame => resolve(newGame))
                        .catch(err => reject(err));
                    }
                });
        });
    },
    getGameStats: (_id) => {
        return new Promise((resolve, reject) => {
            db.Game.find({_id})
            .populate('rounds')
            .then(game => {  
                resolve(game[0].rounds.map((round, rIndex) => {
                    return io.getRoundStats(game[0], rIndex);
                })
                );            
            });
        });
    },
    getRoundStats: (game, index) => {
        const guesses = game.rounds[index].guesses;
        const correct = guesses.filter(guess => guess.isMatch).length;
        const incorrect = guesses.filter(guess => !guess.isMatch).length;

        return {correct, incorrect};
    }
}

module.exports = {
    io
}
