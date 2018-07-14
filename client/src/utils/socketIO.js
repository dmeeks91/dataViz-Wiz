import openSocket from 'socket.io-client';
const socket = openSocket('http://localhost:3000');

function joinGame(details, cb){
    socket.on(`joined`, (game) => {
        console.log(game);
        cb(game);
    });
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

function getStats(gameObj){
    socket.on(`stats`, (stats) => console.log(stats));
    socket.emit(`getStats`, gameObj);
}

export {
    joinGame, 
    startGame,
    endRound,
    getStats
}