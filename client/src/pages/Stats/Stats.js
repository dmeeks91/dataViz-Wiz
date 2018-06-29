import React, { Component } from "react";
import { Container } from "../../components/Grid";
import {Redirect} from "react-router-dom";
import Jumbotron from "../../components/Jumbotron";
import { db } from "../../utils";


class Stats extends Component {
  state = {
    imageUrl: "",
    name: "",
    logIn: false
  };


  // resizeContainer() {    
  //   let sHeight = window.screen.height;
  //   this.setState({
  //     height: (window.screen.width < 500) ? sHeight * .90 : sHeight * 2
  //   });
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

  componentWillMount() {     
    db.table('userProfile')
        .toArray()
        .then(profile => {
            if (profile.length) this.setState({ 
              imageUrl: profile[0].imageUrl, 
              name: profile[0].name,              
            })
            else
            {
              this.setState({logIn: true});
            };
        });
  }


  render() {    
    //Redirect to Login page if not logged in
    if (this.state.logIn) {
        return <Redirect to="/"/>;
    }
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
          <img alt="userImage" style={{width: 250}} src={this.state.imageUrl}/>
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
