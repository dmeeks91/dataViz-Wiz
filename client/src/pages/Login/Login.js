import React, { Component } from "react";
import { GoogleLogin } from 'react-google-login';
import {Container} from "../../components/Grid";
import FontAwesome from 'react-fontawesome';

class Login extends Component {
  state = {
    game: {},
    profile: {},
  };

  componentDidMount() {      
  }

  onLogin(response) {
    console.log(response);
  }
  
  render() {
    return (  
        <div>
            <Container>
                <div className="card">
                    <div className="card-body">
                    </div>
                    <div className="card-footer">
                    <GoogleLogin
                        clientId="354068819828-89tkvid8u657nkilofocsgj9pbg3nh99.apps.googleusercontent.com"
                        onSuccess={this.onLogin}
                        onFailure={this.onLogin}
                    />
                    <FontAwesome
                        name='google'
                    />
                    </div>
                </div>
            </Container>
        </div>
    );
  }
}

export default Login;

