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
import API from "../../utils/API";

class Play extends Component {
  state = {
    board: new board(),
    buttons: [],
    guesses: [],
    guessString: "",
    height: 0,
    login: false,
    matches: [],
    open: false,
    round: 1,
    symbols: {sym1:[],sym2:[]},
    time:15,
    timer: {},
    playerID: "",
    gameID: ""
  };

  alert = (match) => {
    if (this.state.guesses.length !== 2) return;

    if (match)
    {      
      this.setState({
        open: true,
      });
      this.getButtons();
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
              this.setState({playerID: profile[0].id})
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
  };  

  getAnswerArray = () => {
    const { matches } = this.state, {sym1, sym2} = this.state.symbols;
    if (!matches.length) return [];
    const match = matches[matches.length-1];
    const others = [...sym1, ...sym2].filter(symbol => symbol.id !== match.id);

    return this.state.board.getAnswers(match, others);
  };

  getButtons = () => {
    const buttons = this.getAnswerArray().map(symbol =>{
      return (
        <Button className="col-sm-2" 
          bsStyle="primary" key={symbol.id}
          block
          onClick={()=>this.guessName(symbol)}
        >{symbol.name}</Button>
      )
    });

    this.setState({buttons});
  };

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
  };

  getIDBTable = (store) => {
    return new Promise((resolve, reject) => {
      db.table(store)
        .toArray()
        .then((data) => resolve(data[0]));
    });
  };

  getStats = () => {
        //logGame Stats
    db.table('userProfile')
      .toArray()
      .then(profile =>{
        API.getGames(profile[0].id)
        .then((data)=>console.log(data));
      });
  }
  
  guessName = ({id, name}) => {    
    const { round, matches, gameID, playerID } = this.state;
    const match = matches[matches.length-1];

    this.getIDBTable("game")
        .then((game) => {
          //Initialize round array if it doesn't already exist
          if (game.rounds.length !== round) {
            //pushes last round to mongo
            //if ( round > 1) this.timeUp();
            game.rounds.push({
              gameID,
              playerID,
              guesses: []
            });
          }

          //Create New guess
          const newGuess =  {correct: match.name, guess: name};

          //Push new guess to array
          game.rounds[round - 1].guesses.push(newGuess);

          //Update current game object in indexedDB
          db.table("game").update(1, {rounds: game.rounds});
        });

    if (match.id === id)
    {
      this.closeModal();
      this.state.guesses
          .forEach(({ boardID, symbolID }) => this.clickSymbol(boardID, symbolID));
      this.setBoard();
    }
  };
  
  pushRoundToMongo = () => {
    //push most recent round to mongoDB
    this.getIDBTable("game")
        .then(({rounds})=>{
          const index = rounds.length-1;
          const round = rounds[index];
          round.index = index;
          API.saveRound(round)
             .then(data => console.log(data))
             .catch(e => console.log(e));
          // const game = {
          //   id: round.gameID,
          //   win: round.playerID,
          //   lose: null
          // }
          API.updateGame({
            id: round.gameID,
            win: round.playerID,
            lose: null
          }).then(data => console.log(data))
            .catch(e => console.log(e));
        });
  };

  resizeContainer() {    
    this.setState({
      height: window.innerHeight * .90
    });
  };

  render() {
    //Redirect to Login page if not logged in
    if (this.state.logIn) {
        return <Redirect to="/"/>;
    }
    
    // //Define Variables to be passed as props    
    const { open} = this.state,  
          {sym1, sym2} = this.state.symbols;          
    
    //JSX of components to be returned by the render function
    return ( 
    <div>
      <Nav 
          title="DataViz-Wiz"
          page="play"
          time= {this.state.time}//{ (this.state.timer === 0) ? `Time's Up!`: this.state.timer }
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
                type="playImg slideDown"
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
                type="playImg slideDown"
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
                {this.state.buttons}
              </Row>
            </div>
          </div>
        </Modal>
      </Container>
    </div>
    );
  };
  
  setBoard() {    
    const {match, ...symbols} = this.state.board.getSymbols(this.state.matches);
    this.setState({
      symbols,
      guesses: [],
      matches: [...this.state.matches, match]
    });
  };

// Time functions: run defines the tick-rate of once per second, stop clears the interval,
// and decrement counts down to zero and updates the state for the timer in the navbar
  run = () => {
    this.setState({timer: setInterval(this.setTimer, 1000)});
  };

  setTimer = () => {
    let newTime = this.state.time - 1;
    (newTime === -1) ? this.stop() :
    this.setState({
      time: newTime
    })
  };

  stop = () => {
    toast.success(`Time Up!`);
    clearInterval(this.state.timer);
    this.timeUp();
    this.getStats();
  }

  startNewGame() { 
    //Add New game to Mongo
    API.newGame()
    .then( ({data}) => {
      //Clear game in indexedDB
      db.table('game').clear();
      //Add game in indexedDB
      db.table('game')
        .add({id:1, rounds:[]})
        .then(()=>{
          this.setState({gameID: data._id});
          this.setBoard();          
          this.run();
        })
    })
  };

  startRound() {
    //push round to mongo
    this.pushRoundToMongo();

    //new round
    const newRound = this.state.round + 1;
    this.setState({ 
      round: newRound,
      time: 15 //option from state
     });

    //alert new round
    toast.success(`Starting Round #${newRound}`);

    //new board
    this.setBoard();

    //start timer
    this.run();
  }

  timeUp() {
    //increase round index 
    

    this.pushRoundToMongo();
    
    //If round index < 5 start new Round else end game
  };
}

export default Play;