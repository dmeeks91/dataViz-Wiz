import React from "react";
import { Table } from "react-bootstrap";
import Collapsible from 'react-collapsible';
import "./LeaderTable.css";

const LeaderTable = ({header, rows}) => {
  return (
    <Collapsible transitionTime={150} trigger={header} style={{margin: 100}}> 
      <Table responsive striped bordered>
        <tbody>
          {rows.map(({rank, name, score}, index) => {
            return (
              <tr key={index} className="statTR">
                <td>{rank}</td>
                <td>{name}</td>
                <td><span className="badge badge-primary badge-pill multi">{score}</span></td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </Collapsible>    
  )
};
export default LeaderTable;