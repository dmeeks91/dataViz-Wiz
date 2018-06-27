import React, { Component } from "react";
import { GoogleLogin } from 'react-google-login';
import {Container} from "../../components/Grid";
import GLogo from "../../components/GLogo";
import db from "../../utils/indexedDB";
import "./Login.css";
import {Redirect} from "react-router-dom";

class Login extends Component {
  state = {
    goToDashboard: false
  };

  componentDidMount() {     
    db.table('userProfile')
        .toArray()
        .then(profile => {
            //redirect to dashboard if user already logged in
            if (profile.length) this.setState({ goToDashboard: true });
        });
  };

  onLogin(googleUser) {
    const gProfile = googleUser.getBasicProfile();  
    const profile ={
            gId: gProfile.getId(),
            name: gProfile.getName(),
            imageUrl: gProfile.getImageUrl(),
            email: gProfile.getEmail(),
        };

    db.table('userProfile')
      .add(profile)
      .then(id => {
          this.setState({ goToDashboard: true })
      })
    
  };

  onFailure(response){
      console.log(response);
  };
  
  render() {
    if (this.state.goToDashboard) {
        return <Redirect to="/dashboard"/>;
    }
    return (  
        <div>
            <Container>
                <div className="card">
                    <div className="card-body">
                        {/* dataViz-Wiz logo goes here */}
                    </div>
                    <div className="card-footer">
                        <GoogleLogin
                            clientId="354068819828-89tkvid8u657nkilofocsgj9pbg3nh99.apps.googleusercontent.com"
                            onSuccess={(user)=>this.onLogin(user)}
                            onFailure={this.onFailure}
                            className="gBtn"
                        >
                            <GLogo/>
                        </GoogleLogin>
                    </div>
                </div>
            </Container>
        </div>
    );
  }
}

export default Login;

