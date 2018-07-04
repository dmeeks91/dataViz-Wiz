import React from "react";
import { Grid, Row, Col} from "react-bootstrap";
import "./GameBoard.css";

const GameBoard = ({row1, row2, row3, row4, style}) => {
  return (
    <Grid className="GBoard" style={style}>
      <Row key="r1" className="gameRow">
        {row1.map(symbol1 => {
          return (
            <Col key={symbol1.boardID} xs={4} sm={3}>
              <img className="playImg" 
                alt={symbol1.name} 
                id={symbol1.boardID}
                src={symbol1.filepath} 
                key={symbol1.boardID}
                onClick = {symbol1.onClick}
              />
            </Col>
          )
        })}
      </Row>
      <Row key="r2" className="gameRow">
        {row2.map(symbol2 => {
          return (
            <Col key={symbol2.boardID} xs={4} sm={3}>
              <img className="playImg" 
                alt={symbol2.name} 
                id={symbol2.boardID}
                src={symbol2.filepath} 
                key={symbol2.boardID}
                onClick = {symbol2.onClick}
              />
            </Col>
          )
        })}
      </Row>
      <Row key="r3" className="gameRow">
        {row3.map(symbol3 => {
          return (
            <Col key={symbol3.boardID} xs={4} sm={3}>
              <img className="playImg" 
                alt={symbol3.name} 
                id={symbol3.boardID}
                src={symbol3.filepath} 
                key={symbol3.boardID}
                onClick = {symbol3.onClick}
              />
            </Col>
          )
        })}
      </Row>
      <Row key="r4" className="gameRow">
        {row4.map(symbol4 => {
          return (
            <Col key={symbol4.boardID} xs={4} sm={3}>
              <img className="playImg" 
                alt={symbol4.name} 
                id={symbol4.boardID}
                src={symbol4.filepath} 
                key={symbol4.boardID}
                onClick = {symbol4.onClick}
              />
            </Col>
          )
        })}
      </Row>
    </Grid>
  )
};
export default GameBoard;