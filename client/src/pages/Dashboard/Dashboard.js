import React, { Component } from "react";
import {Container} from "../../components/Grid";
import "./Dashboard.css";

class Dashboard extends Component {
  state = {
  };

  componentDidMount() {      
  }
  
  render() {
    return (  
        <Container>
          <img alt="dashboardJPG" src="../images/dashboard.jpg"/>
        </Container>
    );
  }
}

export default Dashboard;
