import React, { Component } from "react";
import {Redirect} from "react-router-dom";
import { Link } from 'react-router-dom';
import db from "../../utils/indexedDB";
import "./Dashboard.css";

class Dashboard extends Component {
  state = {
    logOut: false
  };

  componentDidMount() {      
  };

  logOut(){
    db.table('userProfile')
      .clear()
      .then(()=>{
        this.setState({logOut: true});
      })
  };

  render() {
    if (this.state.logOut) {
        return <Redirect to="/"/>;
    }
    return (  
        <div className="container" id="btnHolder">
          <div className="row">
            <div className="col playCol">
              <Link className="dashLink" to="/play">
                <h1 className="dashBtn">PLAY</h1>
              </Link>
            </div>
            <div className="col learnCol">
              <Link className="dashLink" to="/learn">
                <h1 className="dashBtn">LEARN</h1>
              </Link>
            </div>
          </div>
          <div className="row">
            <div className="col statsCol">
              <Link className="dashLink" to="/stats">
                <h1 className="dashBtn">STATS</h1>
              </Link>
            </div>
            <div className="col logoutCol">
              {/* <Link className="dashLink" to="/"> */}
                <h1 className="dashBtn" onClick={()=>this.logOut()}>LOGOUT</h1>
              {/* </Link> */}
            </div>
          </div>
        </div>
    );
  }
}

export default Dashboard;
