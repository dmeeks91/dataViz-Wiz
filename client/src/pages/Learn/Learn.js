import React, { Component } from "react";
import {Container} from "../../components/Grid";
import {Redirect} from "react-router-dom";
import symbols from "../../symbols.json";
import Symbol from "../../components/Symbol";
import Nav from "../../components/Nav";
import Modal from "react-responsive-modal";
import { db } from "../../utils";
import "./Learn.css";

class Learn extends Component {
  state = {
    open: false,
    height:400,
    symbol: {},
    login: false
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

  resizeContainer() {    
    let sHeight = window.screen.height;
    console.log(sHeight);
    this.setState({
      height: (window.screen.width < 500) ? sHeight * .90 : sHeight * 2
    });
  }

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
            }
        });       
  }

  componentWillUnmount() {  
    window.removeEventListener("resize", () => this.resizeContainer());
  }
  
  render() {
    //Redirect to Login page if not logged in
    if (this.state.logIn) {
        return <Redirect to="/"/>;
    }
    //Define Variables to be passed as props
    const { open } = this.state,
          symName =  (this.state.symbol) ? this.state.symbol.name :"",
          symUrl =  (this.state.symbol) ? this.state.symbol.filepath :"",
          symDesc =  (this.state.symbol) ? this.state.symbol.description :"";

    //JSX of components to be returned by the render function
    return (  
      <div>
        <Nav title="DataViz-Wiz"/>        
        <Container style={{height:this.state.height}}>
          {symbols.map(symbol =>{
            return (
              <Symbol key={symbol.id} 
                name={symbol.name} 
                url={symbol.filepath}
                type="learnImg"
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
      </div>
    );
  }
}

export default Learn;
