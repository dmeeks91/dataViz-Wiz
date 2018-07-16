import React from "react";
import { Table, Button, Badge } from "react-bootstrap";
import "./GameOptions.css";

const GameOptions = ({options}) => {
  const rows = options.map(option => {
    return (
      <tr key={`row_${option.key}`}>
        <td>
          <Button className="subbtn" 
            key={option.key}
            style={option.style}
            block
            onClick={option.click}
          >
            {option.text}            
          </Button>
        </td>
        <td>
        <Badge className="badge-primary badge-pill multi">
          {option.best}
        </Badge>
        </td>
      </tr>
    )
  });
  return (
    <Table responsive>
      <tbody>
        {rows}
      </tbody>
    </Table>
  )
};
export default GameOptions;