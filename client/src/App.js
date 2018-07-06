import React from "react";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Learn from "./pages/Learn";
import Play from "./pages/Play3";
import Stats from "./pages/Stats";
import NoMatch from "./pages/NoMatch";
import { ToastContainer, Zoom } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import {
  BrowserRouter as Router,
  Route,
  Switch,
} from "react-router-dom";



const App = () => (
  <Router>
    <div>
      <ToastContainer
        position="top-center"
        autoClose={1500}
        transition={Zoom}
        hideProgressBar
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnVisibilityChange
        draggable={false}
        pauseOnHover
      />
      <Switch>
        <Route exact path="/" component={Login} />
        <Route exact path="/dashboard" component={Dashboard} />
        <Route exact path="/learn" component={Learn} />
        <Route exact path="/play" component={Play} />
        <Route exact path="/stats" component={Stats} />        
        <Route exact path="/api/user" component={Login} />
        <Route component={NoMatch} />
      </Switch>
    </div>
  </Router>
);

export default App;
