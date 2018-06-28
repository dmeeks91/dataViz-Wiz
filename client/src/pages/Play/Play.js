import React, { Component } from "react";
import {Container} from "../../components/Grid";
import Symbol from "../../components/Symbol";
import symbols from "../../symbols.json";
import Modal from "react-responsive-modal";
import { SimpleSelect } from "react-selectize";
import "./Play.css";

class Play extends Component {
  state = {
    symbols,
    guesses: [],
    open: false
  };

  componentDidMount() {      
  }

  closeModal = () => {
    this.setState({ open: false });
  };

  setModal = () => {
    this.setState({
      open: true,
    })
  };  

  handleGuess = ( {id} ) => {
    let { guesses } = this.state;
    if (guesses.length < 2) {
      guesses.push(id);
    } 
    if (guesses.length === 2) {
      (guesses[0] === guesses[1]) ? this.setModal() : console.log("No Match = Toastr is next");
    } 
  }

  handleName = ( {id} ) => {
    let guess = this.state.guesses[0];
    console.log((guess === id) ? "Name matches guess" : "Toastr: Try again")
    this.closeModal();
  }
  
  render() {
    const { open } = this.state;  
    return (  
      <Container>
        <div className="container">
          <div className="App jumbotron">
            <div className="row">
            {this.state.symbols.map(symbol => (
                <Symbol
                    key={symbol.id}
                    name={symbol.name}
                    url={symbol.filepath}
                    type="playImg"
                    onClick = { () => this.handleGuess(symbol) }
                />
            ))}
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
                      <option key = "mango" value = "mango">mango</option>
                      <option key = "grapes" value = "grapes">grapes</option>
                      <option key = "melon" value = "melon">melon</option>
                      <option key = "strawberry" value = "strawberry">strawberry</option>
                    </SimpleSelect>                    
                    </div>
                  </div>
                </div>
              </div>
            </Modal>
            </div>
          </div>
        </div>
      </Container>
    );
  }
}

export default Play;
