import React, { Component } from "react";
import {Redirect, Link} from "react-router-dom";
import Collapsible from 'react-collapsible';
import Nav from "../../components/Nav";
import Jumbotron from "../../components/Jumbotron";
import { Container } from "../../components/Grid";
import { db }from "../../utils";
import Modal from "react-responsive-modal";
import gameTypes from "../../gameTypes.json";
import { Button } from "react-bootstrap";
import "./Options.css";


class Options extends Component {

    state = {
        open: false,
        options: [],
      };
    
      closeModal = () => {
        this.setState({ open: false });
      };
    
      setModal = () => {
        this.setState({
          open: true
        })
      };  


    // saveTime () {
    //     db.table('userProfile')
    //     .add()
    //     .catch(err => console.log(err));
    // }

    componentDidMount() {  
      this.getGameTypes();

    }

    getGameTypes = () => {
      // console.log(gameTypes[0].options)
      const gameOptions = gameTypes[0].options
      const options = Object.keys(gameOptions).map((key, index) =>{
        console.log(gameOptions[index])
        return (
          <Button className="col-sm-2" 
            bsStyle="primary"
            key={gameOptions[key]}
            block
          >{`${gameOptions[index]} seconds`}</Button>
        )
      });
  
      this.setState({options});
    };



  render() {
    const { open } = this.state

    return(
        <div>
        <Nav title="DataViz-Wiz"/>

        <Container>       
        <div className="card">
        <Collapsible transitionTime={150} trigger="Time Trial"> <h1 onClick = {()=>this.setModal()}> ? </h1>

         <Modal open={open} onClose={this.closeModal} center>
           <div>
               <h1> Hello </h1>
            </div>
        </Modal>

        <Link to="/play">
          {this.state.options}
        </Link>
        </Collapsible>
        </div>

         <div className="card">
        <Collapsible transitionTime={150} trigger="Versus">
          <p>Get Started</p>
        </Collapsible>
        </div>
      </Container>
        </div>
   
      );
    }
}

export default Options;
