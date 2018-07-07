import axios from "axios";

export default  { 
  // Saves a user to the database
  saveUser: function(userID) {
    return axios.post("/api/user", userID);
  },
  newGame: function() {
    return axios.post("/api/new-game")
  },
  
  saveRound: (round) => axios.post("/api/save-round", round),

  getStats: (playerID) => axios.get("/api/get-stats", playerID),

  updateGame: (game) => axios.post("/api/update-game", game)


};
