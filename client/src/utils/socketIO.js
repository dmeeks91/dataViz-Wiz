import openSocket from 'socket.io-client';
const socket = openSocket();//'http://localhost:3000'

function joinGame(details, cb){
    socket.on(`joined`, (game) => cb(game));
    socket.emit(`joinGame`, details);
}

function startGame(gameObj, cb){
    socket.on(`gameStarted`, (game) => cb(game));
    socket.emit(`startGame`, gameObj);
}

function endRound(gameObj, cb){
    socket.on(`roundEnded`, (game) => cb(game));
    socket.emit(`endRound`, gameObj);
}

function getStats(gameObj, playerID, cb){
    socket.on(`stats`, (stats) => cb(stats));
    socket.emit(`getStats`, {game: gameObj, playerID});
}

export {
    joinGame, 
    startGame,
    endRound,
    getStats
}