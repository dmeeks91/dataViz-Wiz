import React from "react";
import { Table } from "react-bootstrap";
import "./MultiResults.css";

const MultiResults = ({myResults, oppResults}) => {
  return (
    <Table responsive striped bordered>
      <thead>
        <tr>
          <th></th>
          <th>{myResults.name}</th>
          <th>{oppResults.name}</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Correct</td>
          <td> <span className="badge badge-primary badge-pill multi">{myResults.correct}</span></td>
          <td> <span className="badge badge-primary badge-pill multi">{oppResults.correct}</span></td>
        </tr>
        <tr>
          <td>Incorrect</td>
          <td> <span className="badge badge-primary badge-pill multi">{myResults.incorrect}</span></td>
          <td> <span className="badge badge-primary badge-pill multi">{oppResults.incorrect}</span></td>
        </tr>
        <tr>
          <td>Total Guesses</td>
          <td> <span className="badge badge-primary badge-pill multi">{myResults.allGuesses}</span></td>
          <td> <span className="badge badge-primary badge-pill multi">{oppResults.allGuesses}</span></td>
        </tr>
      </tbody>
    </Table>
  )
};
export default MultiResults;