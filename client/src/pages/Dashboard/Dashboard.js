import React, { Component } from "react";
import {Redirect, Link} from "react-router-dom";
import { db } from "../../utils";
import Nav from "../../components/Nav";
import "./Dashboard.css";

class Dashboard extends Component {
  state = {
    logOut: false,
    logIn: false,
    container: {height:0},
    dashBtn: {"margin-top":0}
  };

  componentDidMount() {  
    db.table('userProfile')
        .toArray()
        .then(profile => {
            //redirect to login screen if not logged in
            if (!profile.length) this.setState({ logIn: true });
        });  
    this.resizeContainer();
    window.addEventListener("resize", () => this.resizeContainer());  
  };

  componentWillUnmount() {  
    window.removeEventListener("resize", () => this.resizeContainer());
  }

  logOut(){
    db.table('userProfile')
      .clear()
      .then(()=>{
        this.setState({logOut: true});
      })
  };

  resizeContainer() {    
    this.setState({
      container: {height:window.innerHeight * .90},
      dashBtn: {"margin-top": ((window.innerHeight *.88)/ 2)*.45}
    });
  };

  render() {
    if (this.state.logOut || this.state.logIn) {
        return <Redirect to="/"/>;
    }
    const { container, dashBtn } = this.state;
    return (  
      <div>
        <Nav title="DataViz-Wiz"/>
        <div className="container" style={container} id="btnHolder">
          <div className="row" id="row1">
            <div className="col playCol">
              <Link className="dashLink" to="/options">
                <h1 className="dashBtn" style={dashBtn}>PLAY</h1>
              </Link>
            </div>
            <div className="col learnCol">
              <Link className="dashLink" to="/learn">
                <h1 className="dashBtn" style={dashBtn}>LEARN</h1>
              </Link>
            </div>
          </div>
          <div className="row" id="row2">
            <div className="col statsCol">
              <Link className="dashLink" to="/stats">
                <h1 className="dashBtn" style={dashBtn}>STATS</h1>
              </Link>
            </div>
            <div className="col logoutCol" onClick={()=>this.logOut()}>
                <Link className="dashLink" to="/">
                <h1 className="dashBtn" style={dashBtn}>LOGOUT</h1>
                </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Dashboard;
