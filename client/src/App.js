import React from "react";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Learn from "./pages/Learn";
import Play from "./pages/Play";
import Stats from "./pages/Login";
import NoMatch from "./pages/NoMatch";
import Nav from "./components/Nav";
import {
  BrowserRouter as Router,
  Route,
  Switch,
} from "react-router-dom";



const App = () => (
  <Router>
    <div>
      <Nav/>
      <Switch>
        <Route exact path="/" component={Login} />
        <Route exact path="/dashboard" component={Dashboard} />
        <Route exact path="/learn" component={Learn} />
        <Route exact path="/play" component={Play} />
        <Route exact path="/stats" component={Stats} />        
        <Route component={NoMatch} />
      </Switch>
    </div>
  </Router>
);

export default App;
