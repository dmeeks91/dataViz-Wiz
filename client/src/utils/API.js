import axios from "axios";

export default  { 
  // Saves a user to the database
  getGames: (id) => axios.get(`/api/games/${id}`),

  newGame: () => axios.post("/api/new-game"),

  saveUser: (userID) => axios.post("/api/user", userID),  

  saveRound: (round) => axios.post("/api/save-round", round),

  updateGame: (game) => axios.post("/api/update-game", game)

};
