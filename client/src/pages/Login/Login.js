import React, { Component } from "react";
import { GoogleLogin } from 'react-google-login';
import {Container} from "../../components/Grid";
import GLogo from "../../components/GLogo";
import { db } from "../../utils";
import "./Login.css";
import {Redirect} from "react-router-dom";
import { toast } from 'react-toastify';
import API from "../../utils/API";



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
            gID: gProfile.getId(),
            name: gProfile.getName(),
            firstName: gProfile.getGivenName(),
            lastName: gProfile.getFamilyName(),
            imageUrl: gProfile.getImageUrl(),
            email: gProfile.getEmail(),
            id: 1
        };

    API.saveUser(profile)
    .then(e => {
        profile.id = e.data._id;
        db.table('userProfile')
            .add(profile)
            .then(id => {
                toast.success(`Welcome, ${profile.firstName}`);
                this.setState({ goToDashboard: true });
                //add to mongoose ... findAndUpdate 
            })
        console.log(e)
    })
    .catch(err => console.log(err));

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

