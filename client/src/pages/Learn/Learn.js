import React, { Component } from "react";
import {Container} from "../../components/Grid";
import symbols from "../../symbols.json";
import Symbol from "../../components/Symbol";
import Modal from "react-responsive-modal";
import "./Learn.css";

class Learn extends Component {
  state = {
    open: false,
    symbol: {}
  };

  closeModal = () => {
    this.setState({ open: false });
  };

  setModal = (symbol) => {
    this.setState({
      symbol,
      open: true
    })
  };  

  componentDidMount() {      
  }
  
  render() {
    const { open } = this.state,
          symName =  (this.state.symbol) ? this.state.symbol.name :"",
          symUrl =  (this.state.symbol) ? this.state.symbol.filepath :"",
          symDesc =  (this.state.symbol) ? this.state.symbol.description :"";
    return (  
        <Container>
          {symbols.map(symbol =>{
            return (
              <Symbol key={symbol.id} 
                name={symbol.name} 
                url={symbol.filepath}
                onClick = {()=>this.setModal(symbol)}/>
            )
          })}
          <Modal open={open} onClose={this.closeModal} center>
            <div className="card">
              <div className="card-header">
                <h1 className="title">{symName}</h1>
              </div>
              <div className="card-body">
                <div className="row align-items-center">
                  <div className="col-sm-4">
                    <img alt={symName}
                      src={symUrl}/>
                  </div>
                  <div className="col-sm-8">
                    <p>{symDesc}</p>
                  </div>
                </div>
              </div>
            </div>
          </Modal>
        </Container>
    );
  }
}

export default Learn;
