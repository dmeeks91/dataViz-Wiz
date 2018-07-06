import React, { Component } from "react";
import { db, board }from "../../utils";
import {Container} from "../../components/Grid";
import Nav from "../../components/Nav";
import {Redirect} from "react-router-dom";
import Symbol from "../../components/Symbol";
import Modal from "react-responsive-modal";
import { toast } from 'react-toastify';
import { Row, Button } from "react-bootstrap";
import "./Play.css";

class Play extends Component {
  state = {
    board: new board(),
    guesses: [],
    guessString: "",
    height: 0,
    login: false,
    matches: [],
    open: false,
    round: 1,
    symbols: {sym1:[],sym2:[]},
    timer: 10
  };

  alert = (match) => {
    if (this.state.guesses.length !== 2) return;

    if (match)
    {      
      this.setState({
        open: true,
      });
      this.getAnswerArray();
    }
    else if (!document.getElementsByClassName("Toastify__toast Toastify__toast--error").length) 
    {      
      toast.error(`This is not a Match. Try Again!`);
    }
  };

  checkIfMatch() {

    if (this.state.guesses.length !== 2) return;
    const [g1, g2] = this.state.guesses;

    this.alert(g1.symbolID === g2.symbolID);   
  };

  componentDidMount() {  
    db.table('userProfile')
        .toArray()
        .then(profile => {
            //redirect to login screen if not logged in
            if (!profile.length) 
            {
              this.setState({ logIn: true });
            }
            else
            {
              this.resizeContainer();
              window.addEventListener("resize", () => this.resizeContainer());
              this.startNewGame();
            }
        });  
  };

  componentWillUnmount() {  
    window.removeEventListener("resize", () => this.resizeContainer());
  }

  closeModal = () => {
    this.setState({ open: false });
  };

  isSelected = (boardID) => {
    return (
      document.getElementById(boardID)
      .classList.value.indexOf("selected") !== -1
    );
  }  

  getAnswerArray = () => {
    const { matches } = this.state, {sym1, sym2} = this.state.symbols;
    if (!matches.length) return [];
    const match = matches[matches.length-1];
    const others = [...sym1, ...sym2].filter(symbol => symbol.id !== match.id);

    return this.state.board.getAnswers(match, others);
  }

  clickSymbol = (boardID, symbolID) => {
    let guesses = this.state.guesses, action;    
    const selected = this.isSelected(boardID);
    if (!selected && guesses.length < 2)
    { 
      //only add guess if the symbol is not selected 
      //and two symbols have not already been guessed
      guesses.push({boardID, symbolID}); 
      action = "add";
    }
    else if(!selected)
    {
      //remove first guess from array and remove the 'selected' class from the DOM element
      const oldGuess = guesses.shift();
      document.getElementById(oldGuess.boardID).classList.remove("selected");

      //add first guess from array and add the 'selected' class from the DOM element
      guesses.push({boardID, symbolID}); 
      action = "add";
    }
    else 
    { 
      guesses = guesses.filter(guess => guess.boardID !== boardID);
      action = "remove";
    }

    //update state
    this.setState({guesses});
        
    //add/remove CSS class and check if match
    document.getElementById(boardID).classList[action]("selected");    
    if (action === "add") this.checkIfMatch();
  }



  getIDBTable = (store) => {
    return new Promise((resolve, reject) => {
      db.table(store)
        .toArray()
        .then((data) => resolve(data[0]));
    });
  }

  guessName = ({id, name}) => {    
    const { round, matches } = this.state;
    const match = matches[matches.length-1];

    this.getIDBTable("game")
        .then((game) => {
          if (!game.rounds[round]) game.rounds[round] = [];

          const newGuess =  {correct: match.name, guess: name};

          game.rounds[round].push(newGuess);
          db.table("game").update(1, {rounds: game.rounds});
        });

    if (match.id === id)
    {
      this.closeModal();
      this.setBoard();
    }
  }
  
  resizeContainer() {    
    this.setState({
      height: window.innerHeight * .90
    });
  }

  render() {
    //Redirect to Login page if not logged in
    if (this.state.logIn) {
        return <Redirect to="/"/>;
    }
    
    // //Define Variables to be passed as props    
    const { open} = this.state,  
          {sym1, sym2} = this.state.symbols,
          buttons = this.getAnswerArray().map(symbol =>{
            return (
              <Button className="col-sm-2" 
                bsStyle="primary" key={symbol.id}
                block
                onClick={()=>this.guessName(symbol)}
              >{symbol.name}</Button>
            )
          });
    
    //JSX of components to be returned by the render function
    return ( 
    <div>
      <Nav 
          title="DataViz-Wiz"
          page="play"
          time={ (this.state.timer === 0) ? `Time's Up!` : this.state.timer }
      />
      <Container style={{height:this.state.height}}>
        {sym1.map(symbol =>{ 
          const boardID = `sym1_${symbol.id}`;
          return (
            <Symbol
                key = {boardID}
                id = {boardID}  
                name={symbol.name}
                url={symbol.filepath}
                type="playImg"
                onClick = { () => this.clickSymbol(boardID, symbol.id) }
            />
          )}
        )}
        {sym2.map(symbol => { 
          const boardID = `sym2_${symbol.id}`;
          return (
            <Symbol
                key = {boardID}
                id = {boardID}  
                name={symbol.name}
                url={symbol.filepath}
                type="playImg"
                onClick = { () => this.clickSymbol(boardID, symbol.id) }
            />
          )}
        )}
        <Modal open={open} center showCloseIcon={false}
          onClose={this.closeModal} closeOnOverlayClick={false} >
          <div className="card">
            <div className="card-header">
              <h1 id="modalTitle" className="title"><img src={(this.state.matches.length >= 1) ? this.state.matches[this.state.matches.length-1].filepath : ""} alt="Symbol" /></h1>
            </div>
            <div className="card-body">  
              <Row>
                {buttons}
              </Row>
            </div>
          </div>
        </Modal>
      </Container>
    </div>
    );
  }
  
  setBoard() {    
    const {match, ...symbols} = this.state.board.getSymbols(this.state.matches);
    this.setState({
      symbols,
      guesses: [],
      matches: [...this.state.matches, match],
      timer: 10
    });
    this.run();
  }

// Time functions: run defines the tick-rate of once per second, stop clears the interval,
// and decrement counts down to zero and updates the state for the timer in the navbar
  run = () => {
    this.timer = setInterval(() => {
      let newTime = this.state.timer - 1;
      (newTime === -1) ? this.stop() :
      this.setState({
        timer: newTime
      })
  }, 1000)};

  stop = () => {
    clearInterval(this.timer);
  }

  startNewGame() {    
    db.table('game').clear();
    db.table('game')
      .add({id:1, rounds:{}})
      .then(()=>{
        this.setBoard();
      })
  }
}

export default Play;
