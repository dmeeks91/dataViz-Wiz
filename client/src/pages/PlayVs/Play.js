import React, { Component } from "react";
import { db, board }from "../../utils";
import {Container} from "../../components/Grid";
import {Redirect} from "react-router-dom";
import Symbol from "../../components/Symbol";
import symbolList from "../../symbols.json"
import Modal from "react-responsive-modal";
import { toast } from 'react-toastify';
import { FormGroup, FormControl} from "react-bootstrap";
import "./Play.css";

//Trying to get this bootsrtap-select to work
//But it isn't working because JQuery is not defined
//https://github.com/tjwebb/react-bootstrap-select
// React.Bootstrap = require('react-bootstrap');
// React.Bootstrap.Select = require('react-bootstrap-select');

class Play extends Component {
  state = {
    symbols: {sym1:[],sym2:[]},
    guesses: [],
    guessString: 0,
    height: 0,
    login: false,
    open: false,
    matches: [],
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

  handleChange(e) {
    console.log(`value: ${e.target.value}`);
    this.closeModal();
    // this.setState({ value: e.target.value });
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
    
    // //Define Variables to be passed as props
    const options = symbolList.map(symbol => {
      return (
        <option 
          key = {symbol.id}
          value={symbol.id}
        >
          {symbol.name}
        </option>
      )
    })
    
    //Define Variables to be passed as props
    const { open, symbols } = this.state
    
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
        <Modal open={open} center showCloseIcon={false}
          onClose={this.closeModal} >
          <div className="card">
            <div className="card-header">
              <h1 className="title">Select Viz Name</h1>
            </div>
            <div className="card-body">  
              <FormGroup controlId="formControlsSelect">
                <FormControl componentClass="select" 
                  placeholder="select"                  
                  onChange={(e)=>this.handleChange(e)}
                >
                  {options}
                </FormControl>
              </FormGroup>
            </div>
          </div>
        </Modal>
      </Container>
    );
  }
}

export default Play;
