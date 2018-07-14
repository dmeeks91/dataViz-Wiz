import React, { Component } from "react";
import { Container } from "../../components/Grid";
import {Redirect} from "react-router-dom";
import Jumbotron from "../../components/Jumbotron";
import Nav from "../../components/Nav";
import { db } from "../../utils";
import API from "../../utils/API";


class Stats extends Component {
  state = {
    imageUrl: "",
    name: "",
    logIn: false,
    playerID: "",
    games: [],
    stats: []
  };

  handleInputChange = event => {
    const { name, value } = event.target;
    this.setState({
      [name]: value
    });
  };

  componentWillMount() {     
    db.table('userProfile')
        .toArray()
        .then(profile => {
            if (profile.length) this.setState({ 
              imageUrl: profile[0].imageUrl, 
              name: profile[0].name,              
            })
            else
            {
              this.setState({logIn: true});
            };
        });
  };

  componentDidMount() {
    db.table('userProfile')
    .toArray()
    .then(profile => {
          this.setState({playerID: profile[0].id})
          this.getGames();
    })
  };

  getGames = () => {
    db.table('userProfile')
      .toArray()
      .then(profile =>{
        API.getGames(profile[0].id)
        .then((data)=> {
          const games = data.data; 
          this.setState({games});
          this.getAllGameStats();
        });
      });
  };

  getAllGameStats = () => {
    this.setState({stats: []});
    this.state.games.forEach((game, index) => {
      return this.getGameStats(index);
    });
    // db.table('userProfile')
    //   .update(this.state.playerID,{stats: this.state.stats});
  };

  getGameStats = (index) => {
    const gameStats = {};
    this.state.games[index].rounds.forEach((round, rIndex) => {
      gameStats[`round_${rIndex}`] = this.getRoundStats(this.state.games[index], rIndex);
    });
    
    this.setState({stats: [...this.state.stats, gameStats]});
  };

  getRoundStats = (game, index) => {
    const guesses = game.rounds[index].guesses;
    const questionArr = guesses.map(guess => guess.correct).filter((item, i, ar) => ar.indexOf(item) === i);
    const currStats = questionArr.map(sym => {
        const correct = guesses.filter(guess => guess.guess === sym && guess.isMatch).length;
        const allGuesses = guesses.filter(guess => guess.correct === sym).length;
        const accuracy = correct / allGuesses;
        return {correct, allGuesses, accuracy, name: sym};
    })
    return currStats;
  };

  render() {    
    //Redirect to Login page if not logged in
    if (this.state.logIn) {
        return <Redirect to="/"/>;
    }
    return (
    <div>
      <Nav title="DataViz-Wiz"/>
      <Container>       
        <Jumbotron
        style={{
          color: "#adc25d"
        }}
        >
        {/* <div className="row">
          <div className="col-sm-11">
          <h1 style={{textAlign:"center", marginTop: 0}}>Stats</h1>
          </div>
          </div> */}

          <div className="row">
            <div className="col-sm-2">
          <img alt="userImage" style={{width: 200, marginTop: 18}} src={this.state.imageUrl}/>
            </div>
            <div className="col-sm-8">
              <p style={{fontSize: 40, marginTop:40, fontWeight: 700, textDecoration: "underline"}}> {this.state.name} </p>
              {/* <p style={{fontSize: 30, marginTop:40}}> and maybe something else about them </p> */}
              </div>
          </div>


          <div className="row align-items-center" style= {{ textAlign: "center",  }}>

          <div className="col-sm-6 col-8">
          <h2 style={{marginTop: 20,}}> Total Wins: </h2>
          </div>

          <div className="col-sm-6 col-4">
          <p style={{marginTop: 40, fontFamily: "courier new", fontSize: 28}}> 4 </p>
          </div>

          </div>

          <div className="row align-items-center" style= {{ textAlign: "center",  }}>

          <div className="col-sm-6 col-8">
          <h2 style={{marginTop: 20,}}> Total Games Played: </h2>
          </div>

          <div className="col-sm-6 col-4">
          <p style={{marginTop: 40, fontFamily: "courier new", fontSize: 28}}> 973 </p>
          </div>

          </div>

          <div className="row align-items-center" style= {{ textAlign: "center",  }}>

          <div className="col-sm-6 col-8">
          <h2 style={{marginTop: 20,}}> Most missed symbol: </h2>
          </div> 

          <div className="col-sm-6 col-4">
          <p style={{marginTop: 40, fontFamily: "courier new", fontSize: 28}}> Word Cloud </p>
          </div>

          </div>


        </Jumbotron>
      </Container>
    </div>
    );
  };
}

export default Stats;
