import axios from "axios";

export default  { 
  getGames: (id) => axios.get(`/api/games/${id}`),
 
  getStats: (playerID) => axios.get("/api/get-stats", playerID),  
 
  newGame: () => axios.post("/api/new-game"), 
 
  saveUser: (userID) => axios.post("/api/user", userID),   
 
  saveRound: (round) => axios.post("/api/save-round", round), 
 
  updateGame: (game) => axios.post("/api/update-game", game) 

};
