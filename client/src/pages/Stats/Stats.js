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
    height: 0,
    stats: [],
    rounds: [],
    mostMissed: "",
    totalGames: 0,
    avgRounds: 0
  };
    
  componentDidMount() {     
    db.table('userProfile')
        .toArray()
        .then(profile => {
            if (profile.length) 
            {
              this.setState({ 
                playerID: profile[0].id,
                imageUrl: profile[0].imageUrl, 
                name: profile[0].name,              
              });
              this.getGames();
              this.getUserRounds();
              this.resizeContainer();
              window.addEventListener("resize", () => this.resizeContainer());
            }
            else
            {
              this.setState({logIn: true});
            };
        });
  };

  componentWillUnmount() {  
    window.removeEventListener("resize", () => this.resizeContainer());
  };

  getAllGameStats = () => {
    this.setState({stats: []});
    this.state.games.forEach((game, index) => {
      return this.getGameStats(index);
    });
    this.setState({avgRounds: (this.state.rounds.length / this.state.stats.length).toFixed(2)});
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

  getGameStats = (index) => {
    const gameStats = {};
    this.state.games[index].rounds.forEach((round, rIndex) => {
      gameStats[`round_${rIndex}`] = this.getRoundStatsByGame(this.state.games[index], rIndex);
    });    
    let stats = [...this.state.stats, gameStats];
    this.setState({stats});
    this.setState({totalGames: this.state.stats.length});
  };

  getMostMissed = () => {
    const roundArr = this.state.rounds;

    const numerator = roundArr.reduce((accumulator, currRound) => {
      accumulator[currRound.name] = (accumulator[currRound.name] || 0) + currRound.accuracy;
      return accumulator;
    } , {});

    const denominator = roundArr.reduce((accumulator, currRound) => {
      accumulator[currRound.name] = (accumulator[currRound.name] || 0) + 1;
      return accumulator;
    } , {});

    let accuracy = [];
    for (var i in numerator) {
      accuracy.push([i, numerator[i] / denominator[i]]);
    };
    accuracy.sort(function(a, b) {
      return a[1] - b[1];
    });

    this.setState({mostMissed: accuracy[0][0]});
  };

  getRoundStatsByGame = (game, index) => {
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

  getRoundStatsByUser = (rounds) => {
    return rounds.map(round => {
      const questionArr = round.guesses.map(guess => guess.correct).filter((item, i, ar) => ar.indexOf(item) === i);
      const currStats = questionArr.map(sym => {
            const correct = round.guesses.filter(guess => guess.guess === sym && guess.isMatch).length;
            const allGuesses = round.guesses.filter(guess => guess.correct === sym).length;
            const accuracy = correct / allGuesses;
            return {correct, allGuesses, accuracy, name: sym};
        });
      return currStats;
    }).reduce((a, b) => {return a.concat(b)}, []);
  };

  getUserRounds = () => {
    API.getRounds(this.state.playerID)
    .then(({ data })=> {
      this.setState({rounds: this.getRoundStatsByUser(data)});
      this.getMostMissed();
    });
  };

  render() {    
    //Redirect to Login page if not logged in
    if (this.state.logIn) {
        return <Redirect to="/"/>;
    }
    return (
    <div>
      <Nav title="DataViz-Wiz"/>
      <Container style={{height:this.state.height}}>       
        <Jumbotron style={{color: "#adc25d", marginBottom: "0px"}}>
          <div className="row">
            <div className="col-sm-2">
              <img alt="userImage" style={{width: 200, marginTop: 10}} src={this.state.imageUrl}/>
            </div>
            <div className="col-sm-8">
              <p style={{fontSize: 30, marginTop:10, fontWeight: 700, textDecoration: "underline"}}> {this.state.name} </p>
            </div>
          </div>
          {/* <div className="row align-items-center">
            <div className="col-sm-6 col-8">
              <p style={{marginTop: 10, fontSize: 20, fontWeight: "bold", textAlign: "right"}}> Total Wins: </p>
            </div>
            <div className="col-sm-6 col-4">
              <p style={{marginTop: 10, fontSize: 20, textAlign: "left"}}> 4 </p>
            </div>
          </div> */}
          <div className="row align-items-center">
            <div className="col-sm-6 col-6">
              <p style={{marginTop: 10, fontSize: 20, fontWeight: "bold", textAlign: "right"}}> Total Games: </p>
            </div>
            <div className="col-sm-6 col-6">
              <p style={{marginTop: 10, fontSize: 20, textAlign: "left"}}> {this.state.totalGames} </p>
            </div>
          </div>
          <div className="row align-items-center">
            <div className="col-sm-6 col-6">
              <p style={{marginTop: 10, fontSize: 20, fontWeight: "bold", textAlign: "right"}}> Average Score: </p>
            </div>
            <div className="col-sm-6 col-6">
              <p style={{marginTop: 10, fontSize: 20, textAlign: "left"}}> {this.state.avgRounds} </p>
            </div>
          </div>
          <div className="row align-items-center">
            <div className="col-sm-6 col-6">
              <p style={{marginTop: 10, fontSize: 20, fontWeight: "bold", textAlign: "right"}}> Most Missed: </p>
            </div> 
            <div className="col-sm-6 col-6">
              <p style={{marginTop: 10, fontSize: 20, textAlign: "left"}}> {this.state.mostMissed} </p>
            </div>
          </div>

        </Jumbotron>
      </Container>
    </div>
    );
  };

  resizeContainer() {    
    this.setState({
      height: window.innerHeight * .90
    });
  };
}

export default Stats;
