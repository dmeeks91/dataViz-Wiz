import React, { Component } from "react";
import { db, board }from "../../utils";
import {Container} from "../../components/Grid";
import {Redirect} from "react-router-dom";
import Symbol from "../../components/Symbol";
import symbolList from "../../symbols.json"
import Modal from "react-responsive-modal";
import { SimpleSelect } from "react-selectize";
import { toast } from 'react-toastify';
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
    search:{}
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
    this.setState({
      height: window.innerHeight * .90
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
    const { open, symbols } = this.state;  

    //JSX of components to be returned by the render function
    return (  
      <Container style={{height:this.state.height}}>
        {symbols.sym1.map(symbol =>{ 
          const boardID = `sym1_${symbol.id}`;
          return (
            <Symbol
                key = {boardID}
                id = {boardID}  
                name={symbol.name}
                url={symbol.filepath}
                type="playImg"
                onClick = { () => this.handleGuess(boardID, symbol.id) }
            />
          )}
        )}
        {symbols.sym2.map(symbol => { 
          const boardID = `sym2_${symbol.id}`;
          return (
            <Symbol
                key = {boardID}
                id = {boardID}  
                name={symbol.name}
                url={symbol.filepath}
                type="playImg"
                onClick = { () => this.handleGuess(boardID, symbol.id) }
            />
          )}
        )}
        <Modal open={open} onClose={this.closeModal} center>
          <div className="card">
            <div className="card-header">
              <h1 className="title">Select Viz Name</h1>
            </div>
            <div className="card-body">             
              <SimpleSelect options = {options}></SimpleSelect>                   
            </div>
          </div>
        </Modal>
      </Container>
    );
  }
}

export default Play;
