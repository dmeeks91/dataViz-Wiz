import React from "react";
import { Grid, Row, Col} from "react-bootstrap";
import "./GameBoard.css";

const GameBoard = ({row1, row2, row3, row4, style}) => {
  return (
    <Grid className="GBoard" style={style}>
      <Row key="r1" className="gameRow">
        {row1.map(symbol => {
          return (
            <Col key={symbol.boardID} xs={4} sm={3}>
              <img className="playImg" 
                alt={symbol.name} 
                id={symbol.boardID}
                src={symbol.filepath} 
                key={symbol.boardID}
                onClick = {symbol.onClick}
              />
            </Col>
          )
        })}
      </Row>
      <Row key="r2" className="gameRow">
        {row2.map(symbol => {
          return (
            <Col key={symbol.boardID} xs={4} sm={3}>
              <img className="playImg" 
                alt={symbol.name} 
                id={symbol.boardID}
                src={symbol.filepath} 
                key={symbol.boardID}
                onClick = {symbol.onClick}
              />
            </Col>
          )
        })}
      </Row>
      <Row key="r3" className="gameRow">
        {row3.map(symbol => {
          return (
            <Col key={symbol.boardID} xs={4} sm={3}>
              <img className="playImg" 
                alt={symbol.name} 
                id={symbol.boardID}
                src={symbol.filepath} 
                key={symbol.boardID}
                onClick = {symbol.onClick}
              />
            </Col>
          )
        })}
      </Row>
      <Row key="r4" className="gameRow">
        {row4.map(symbol => {
          return (
            <Col key={symbol.boardID} xs={4} sm={3}>
              <img className="playImg" 
                alt={symbol.name} 
                id={symbol.boardID}
                src={symbol.filepath} 
                key={symbol.boardID}
                onClick = {symbol.onClick}
              />
            </Col>
          )
        })}
      </Row>
    </Grid>
  )
};
export default GameBoard;