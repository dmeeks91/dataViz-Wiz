import React, { Component } from "react";
import {Redirect, Link} from "react-router-dom";
import Collapsible from 'react-collapsible';
import Nav from "../../components/Nav";
import Jumbotron from "../../components/Jumbotron";
import { Container } from "../../components/Grid";
import { db }from "../../utils";
import Modal from "react-responsive-modal";
import "./Options.css";


class Options extends Component {

    state = {
        open: false,
      };
    
      closeModal = () => {
        this.setState({ open: false });
      };
    
      setModal = () => {
        this.setState({
          open: true
        })
      };  


    saveTime () {
        db.table('userProfile')
        .add()
        .catch(err => console.log(err));
    }



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
          <p value="30">30 seconds</p>
          <p>60 seconds</p>
          <p>90 seconds</p>
          <p>120 seconds</p>
        </Link>
        </Collapsible>
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
