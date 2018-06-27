import React, { Component } from "react";
import {Container} from "../../components/Grid";
import Modal from "react-responsive-modal";
import "./Learn.css";

class Learn extends Component {
  state = {
    open: false
  };

  displayModal = (show) => {
    this.setState({ open: show });
  };

  componentDidMount() {      
  }
  
  render() {
    return (  
        <Container>
          
        </Container>
    );
  }
}

export default Learn;
