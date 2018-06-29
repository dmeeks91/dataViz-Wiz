import React, { Component } from "react";
import { db, board }from "../../utils";
import {Container} from "../../components/Grid";
import {Redirect} from "react-router-dom";
import GameBoard from "../../components/GameBoard";
import symbolList from "../../symbols.json"
import Modal from "react-responsive-modal";
import { toast } from 'react-toastify';
import { FormGroup, FormControl} from "react-bootstrap";
import "./Play.css";

class Play extends Component {
  state = {
    symbols: {sym1:[],sym2:[]},
    guesses: [],
    height: 0,
    login: false,
    open: false,
    matches: [],
    selectedValue: {},
    search:{},
    style: {}
  };

  alert = (match) => {
    if (this.state.guesses.length !== 2) return;

    if (match)
    {      
      this.setState({
        open: true,
      })
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
              const thisBoard = new board();
              const {match, ...symbols} = thisBoard.getSymbols(this.state.matches);
              this.setState({
                symbols,
                matches: [...this.state.matches, match]
              });
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

  handleChange(e) {
    this.setState({ value: e.target.value });
  }

  handleGuess = (boardID, symbolID) => {
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

  handleName = ( {id} ) => {
    let guess = this.state.guesses[0];
    console.log((guess === id) ? "Name matches guess" : "Toastr: Try again")
    this.closeModal();
  }
  
  resizeContainer() { 
    const navHeight = document.getElementById("navBar").offsetHeight;
    this.setState({
      style: { height: window.innerHeight - navHeight, paddingTop: navHeight/2}
    });
  }

  render() {
    //Redirect to Login page if not logged in
    if (this.state.logIn) {
        return <Redirect to="/"/>;
    }
    
    //Define Variables to be passed as props
    const options = symbolList.map(function(symbol){
        return {label: symbol.name, value: symbol.id}
    });

    //Define Variables to be passed as props
    const { open } = this.state,  {sym1, sym2} = this.state.symbols
    //JSX of components to be returned by the render function
    return (  
      <Container style={this.state.style}>
        <GameBoard 
          row1 = {sym1.slice(0,3).map(symbol1 => {
            symbol1.boardID = `rw1_${symbol1.id}`;
            symbol1.onClick = () => this.handleGuess(symbol1.boardID, symbol1.id);
            return symbol1;
          })}
          row2 = {sym1.slice(3,6).map(symbol2 => {
            symbol2.boardID = `rw2_${symbol2.id}`;
            symbol2.onClick = () => this.handleGuess(symbol2.boardID, symbol2.id);
            return symbol2;
          })}
          row3 = {sym2.slice(0,3).map(symbol3 => {
            symbol3.boardID = `rw3_${symbol3.id}`;
            symbol3.onClick = () => this.handleGuess(symbol3.boardID, symbol3.id);
            return symbol3;
          })}
          row4 = {sym2.slice(3,6).map(symbol4 => {
            symbol4.boardID = `rw4_${symbol4.id}`;
            symbol4.onClick = () => this.handleGuess(symbol4.boardID, symbol4.id);
            return symbol4;
          })}
          style={this.state.style}
        />        
        <Modal open={open} onClose={this.closeModal} center>
          <div className="card">
            <div className="card-header">
              <h1 className="title">Select Viz Name</h1>
            </div>
            <div className="card-body">             
            <FormGroup controlId="formControlsSelect">
              <FormControl componentClass="select" 
                placeholder="select"
                options={options}
                onChange={this.handleChange}
              />
            </FormGroup>
            </div>
          </div>
        </Modal>
      </Container>
    );
  }
}

export default Play;
