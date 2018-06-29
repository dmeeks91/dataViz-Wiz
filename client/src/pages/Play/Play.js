import React, { Component } from "react";
import { db, board }from "../../utils";
import {Container} from "../../components/Grid";
import {Redirect} from "react-router-dom";
import Symbol from "../../components/Symbol";
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
    matches: []
  };

  alert = (match) => {
    if (this.state.guesses.length !== 2) return;

    if (match)
    {      
      this.setState({
        open: true,
      })
    }
    else 
    {
      toast.error(`This is not a Match. Try Again!`);
    }
  };

  checkIfMatch() {

    if (this.state.guesses.length !== 2) return;
    console.log("Checking if match");
    //let { guesses } = this.state;

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

  handleGuess = (boardID, symbol) => {
    let guesses = this.state.guesses, action;    

    if (!this.isSelected(boardID) && guesses.length < 2)
    { 
      //only add guess if the symbol is not selected 
      //and two symbols have not already been guessed
      guesses.push({boardID, symbolID: symbol.id}); 
      action = "add";
    }
    else
    { 
      guesses = guesses.filter(guess => guess.boardID !== boardID);
      action = "remove";
    }

    //update state
    this.setState({guesses});
        
    //add/remove CSS class
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
    const { open, symbols } = this.state;  

    //JSX of components to be returned by the render function
    return (  
      <Container style={{height:this.state.height}}>
        {symbols.sym1.map(symbol =>{ 
          const id = `sym1_${symbol.id}`;
        return (
          <Symbol
              key = {id}
              id = {id}  
              name={symbol.name}
              url={symbol.filepath}
              type="playImg"
              onClick = { () => this.handleGuess(id, symbol) }
          />
        )}
        )}
        {symbols.sym2.map(symbol => { 
          const id = `sym2_${symbol.id}`;
          return (
            <Symbol
                key = {id}
                id = {id}  
                name={symbol.name}
                url={symbol.filepath}
                type="playImg"
                onClick = { () => this.handleGuess(id, symbol) }
            />
          )}
        )}
        <Modal open={open} onClose={this.closeModal} center>
          <div className="card">
            <div className="card-header">
              <h1 className="title">Select Viz Name</h1>
            </div>
            <div className="card-body">
              <div className="row align-items-center">
                <div className="col-sm-12">
                <SimpleSelect 
                    placeholder = "Select a fruit" 
                    ref = "select"

                    // default value support
                    defaultValue = {{label: "melon", value: "melon"}}

                    // on change callback
                    onValueChange = {function(value){
                        console.log("you selected: " + JSON.stringify(value, null, 4));
                    }}

                    // form serialization
                    name = "fruit"
                    serialize = {function(item){
                        return !!item ? item.value : undefined
                    }} // <- optional in this case, default implementation
                >
                  <option key = "apple" value = "apple">apple</option>
                </SimpleSelect>                    
                </div>
              </div>
            </div>
          </div>
        </Modal>
      </Container>
    );
  }
}

export default Play;
