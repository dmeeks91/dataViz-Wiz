import React from "react";
import { Table } from "react-bootstrap";
import "./SingleResults.css";

const SingleResults = ({myResults}) => {
  return (
    <Table responsive striped bordered>
      <tbody>
        <tr>
          <td>Correct</td>
          <td> <span className="badge badge-primary badge-pill multi">{myResults.correct}</span></td>
        </tr>
        <tr>
          <td>Inorrect</td>
          <td> <span className="badge badge-primary badge-pill multi">{myResults.incorrect}</span></td>
        </tr>
        <tr>
          <td>Total Guesses</td>
          <td> <span className="badge badge-primary badge-pill multi">{myResults.allGuesses}</span></td>
        </tr>
      </tbody>
    </Table>
  )
};
export default SingleResults;