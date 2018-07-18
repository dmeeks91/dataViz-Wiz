// import openSocket from 'socket.io-client';
// const socket = openSocket();//'http://localhost:3000'

function joinGame(socket, details, cb){
    //if (!socket) socket = openSocket();
    socket.on(`joined`, (game) => cb(game));
    socket.emit(`joinGame`, details);
    console.log("Pre-Game Socket");
    console.log(socket);
}

function startGame(socket, gameObj, cb){
    //if (!socket) socket = openSocket();
    socket.on(`gameStarted`, (game) => cb(game));
    socket.emit(`startGame`, gameObj);
}

// function endRound(gameObj, cb){
//     socket.on(`roundEnded`, (game) => cb(game));
//     socket.emit(`endRound`, gameObj);
// }

function getStats(socket, gameObj, playerID, cb){
    //if (!socket) socket = openSocket();
    socket.on(`stats`, (stats) => cb(stats));
    socket.emit(`getStats`, {game: gameObj, playerID});
    // console.log("Post-Game Socket");
    // console.log(socket);
    // setTimeout(() => {
    //     socket.disconnect(true);
    //     console.log("Post-Disconnect Socket");
    //     console.log(socket);
    // }, 5000);
}

function disconnect(socket)
{
    socket.disconnect(true);
}

export {
    joinGame, 
    startGame,
    disconnect,
    getStats
}