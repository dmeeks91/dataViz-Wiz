import React from "react";
import "./SingleResults.css";

const SingleResults = ({myResults}) => {
  return (
    <ul className="list-group">
      <li style= {{ fontSize: 20 }} className="list-group-item d-flex justify-content-between align-items-center">
        Correct: 
        <span className="badge badge-primary badge-pill"> {myResults.correct} </span>
      </li>
      <li  style= {{ fontSize: 20 }} className="list-group-item d-flex justify-content-between align-items-center">
        Incorrect: 
        <span className="badge badge-primary badge-pill"> {myResults.incorrect} </span>
      </li>
      <li  style= {{ fontSize: 20 }} className="list-group-item d-flex justify-content-between align-items-center">
        Total Guesses: 
        <span className="badge badge-primary badge-pill"> {myResults.allGuesses} </span>
      </li>
    </ul> 
  )
};
export default SingleResults;