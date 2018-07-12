import openSocket from 'socket.io-client';
const socket = openSocket('http://localhost:3000');

function joinGame(playerID, cb){
    socket.on(`joined`, (gameID) => console.log(gameID));

    socket.emit(`joinGame`, playerID);
}

export {
    joinGame,
}