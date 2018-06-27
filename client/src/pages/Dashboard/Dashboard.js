import React, { Component } from "react";
// import {Container} from "../../components/Grid";
import { Link } from 'react-router-dom';
import "./Dashboard.css";

class Dashboard extends Component {
  state = {
  };

  componentDidMount() {      
  }
  
  render() {
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
              <Link className="dashLink" to="/">
                <h1 className="dashBtn">LOGOUT</h1>
              </Link>
            </div>
          </div>
        </div>
    );
  }
}

export default Dashboard;
