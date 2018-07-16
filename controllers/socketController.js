const db = require("../models");

const io = {
    connect: (client, server) => {
        client.on('joinGame', (game) => {
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
            if (game.type === 1 && game.players.length === 2)
            {                
                setTimeout(() => {
                    server.to(game._id).emit('gameStarted', game);
                }, 1500); 
            }
            else if (game.type === 0)
            {
                server.to(game._id).emit('gameStarted', game);
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
        client.on('getStats', ({game, playerID}) => {
            if (game.players[0].id != playerID) return;
            const { players, type, _id } = game;
            io.getGameStats(_id, players)
                .then(stats => {
                server.in(game._id).emit('stats', stats);
                });
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
    getGameStats: (_id, players) => {
        return new Promise((resolve, reject) => {
            db.Game.find({_id})
            .populate('rounds')
            .then(game => {
                const stats = {};
                players.forEach(player => {
                    stats[player.id] = io.getStatsByPlayer(game[0], player.id);
                });  
                resolve(stats);   
            });
        });
    },
    getStatsByPlayer: (game, playerID)=>{
        return game.rounds
            .filter(round => round.playerID === playerID)
            .map((round, rIndex) => {
                return io.getRoundStats(round, io.getPlayerName(game, playerID));
            });
    },
    getRoundStats: (round, name) => {
        // console.log("round");
        // console.log(round);
        const guesses = round.guesses;
        const correct = guesses.filter(guess => guess.isMatch).length;
        const incorrect = guesses.filter(guess => !guess.isMatch).length;
        const allGuesses = guesses.length;
        return {correct, incorrect, allGuesses, name};
    },
    getPlayerName: (game, playerID) => {
        return game.players.filter(player=>player.id === playerID)
                   .map(player => player.name)[0];
    }
}

module.exports = {
    io
}
