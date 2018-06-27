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
        <div className="row btnHolder">
            <div className="col">
              <Link to="/play">
                <img className="dashImg" alt="play" src="../images/Play.png"/>
              </Link>
            </div>
            <div className="col">
              <Link to="/learn">
                <img className="dashImg" alt="learn" src="../images/Learn.png"/>
              </Link>
            </div>
            <div className="w-100"></div>
            <div className="col">
              <Link to="/stats">
                <img className="dashImg" alt="stats" src="../images/Stats.png"/>
              </Link>
            </div>
            <div className="col">
              <Link to="/">
                <img className="dashImg" alt="logout" src="../images/Logout.png"/>
              </Link>
            </div>
        </div>
    );
  }
}

export default Dashboard;
