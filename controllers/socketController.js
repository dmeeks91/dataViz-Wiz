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
                        if (game)
                        {
                            client.join(game._id);
                            client.emit('joined', game);
                        }
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
            if (game.players[0].id !== playerID) return;    
            const { players, type, _id } = game;
            // console.log(type);
            io.getGameStats(_id, players)
                .then(stats => {
                    if (type) 
                    {
                        // console.log(stats);
                        server.in(game._id).emit('stats', stats);
                    }
                    else 
                    { 
                        client.emit('stats', stats);                        
                    }                    
                });
        });
    },
    findOpenGame: ({ option, playerID, playerName, type }) => {
       return new Promise((resolve, reject) => {           
           db.Game.find({closed:false, type, $where:"this.players.length < 3"})
                .then(games => {
                    if (games.length === 1)
                    {
                        //console.log("join existing game");
                        const { _id, players } = games[0];
                        if(!players.filter(player => player.id === _id).length)
                        {
                            //you are not one of the players already in the game
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
                    else
                    {
                        //console.log("close open game");
                        db.Game.findByIdAndUpdate(_id,
                            { closed: true }, 
                            { new: true })
                            .then(() => resolve(null))
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
        const name =  io.getPlayerName(game, playerID);
        const stats = game.rounds
            .filter(round => round.playerID === playerID)
            .map((round, rIndex) => {
                return io.getRoundStats(round, name);
            });
        
            console.log(stats);
        //return blank array if the user didn't make any guesses
        //This step is necessary because getRoundStats is not called if the player didn't make any guesses in the alotted time
        if (!stats.length) stats[0] = {correct: 0, incorrect: 0, allGuesses: 0, name};
        
        return stats;
    },
    getRoundStats: (round, name) => {
        //this is only called if player made a guess
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
