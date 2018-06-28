import React, { Component } from "react";
import API from "../../utils/API";
import { Link } from "react-router-dom";
import { Col, Row, Container } from "../../components/Grid";
import { List, ListItem } from "../../components/List";
import { Input, TextArea, FormBtn } from "../../components/Form";
import DeleteBtn from "../../components/DeleteBtn";
import Jumbotron from "../../components/Jumbotron";
import db from "../../utils/indexedDB";


class Stats extends Component {
  state = {
    imageUrl: "",
    name: "",

  };


  // resizeContainer() {    
  //   let sHeight = window.screen.height;
  //   this.setState({
  //     height: (window.screen.width < 500) ? sHeight * .90 : sHeight * 2
  //   });
  // }

  // componentDidMount() {      
  //   this.resizeContainer();
  //   window.addEventListener("resize", () => this.resizeContainer());
  // }

  // componentWillUnmount() {  
  //   window.removeEventListener("resize", () => this.resizeContainer());
  // }

  handleInputChange = event => {
    const { name, value } = event.target;
    this.setState({
      [name]: value
    });
  };

  componentDidMount() {     
    db.table('userProfile')
        .toArray()
        .then(profile => {
            //redirect to dashboard if user already logged in
            if (profile.length) this.setState({ imageUrl: profile[0].imageUrl, name: profile[0].name });
        });
  }


  render() {
    return (
      <Container>
       
            <Jumbotron>
            <div className="row">
              <div className="col-sm-11">
              <h1 style={{textAlign:"center", marginTop: 0}}>Stats</h1>
              </div>
              </div>

              <div className="row">
                <div className="col-sm-2">
              <img style={{width: 250}} src={this.state.imageUrl}/>
                </div>
                <div className="col-sm-2"></div>
                <div className="col-sm-8">
                  <p style={{fontSize: 60, marginTop:40}}> {this.state.name} </p>
                  {/* <p style={{fontSize: 30, marginTop:40}}> and maybe something else about them </p> */}
                  </div>
              </div>


              <div className="row" style= {{ textAlign: "center",  }}>

              <div className="col-sm-3">
              <h2 style={{marginTop: 20}}> Total Wins: 
              <p style={{marginTop: 40}}> 4 </p>
              </h2>
              </div>

              <div className="col-sm-4">
              <h2 style={{marginTop: 20}}> Most missed symbol: <p style={{marginTop: 40}}> Scatter Plot </p>
                </h2>

              </div>

              <div className="col-sm-4">
              <h2 style={{marginTop: 20}}> Total playtime: <p style={{marginTop: 40}}> 3hrs 4min </p>
                </h2>

              </div>

              </div>
            </Jumbotron>
              
            
            
      </Container>
    );
  }
}

export default Stats;
