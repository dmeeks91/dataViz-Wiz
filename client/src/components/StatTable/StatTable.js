import React from "react";
import { Table } from "react-bootstrap";
import Collapsible from 'react-collapsible';
import "./StatTable.css";

const StatTable = ({header, rows}) => {
  return (
    <Collapsible transitionTime={150} trigger={header} style={{margin: 100}}> 
      <Table responsive striped bordered>
        <tbody>
          {rows.map(({key, val}) => {
            return (
              <tr className="statTR">
                <td>{key}</td>
                <td><span className="badge badge-primary badge-pill multi">{val}</span></td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </Collapsible>    
  )
};
export default StatTable;