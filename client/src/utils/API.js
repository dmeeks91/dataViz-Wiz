import axios from "axios";

export default  { 
  // Saves a user to the database
  saveUser: function(userID) {
    console.log(userID)
    return axios.post("/api/user", userID);
  },
  newGame: function() {
  return axios.post("/api/newgame")
  }

};
