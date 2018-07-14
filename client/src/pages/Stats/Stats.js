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
    stats: [],
    rounds: [],
    mostMissed: "",
    totalGames: 0,
    avgRounds: 0
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
  }

  componentDidMount() {
    db.table('userProfile')
    .toArray()
    .then(profile => {
          this.setState({playerID: profile[0].id})
          this.getGames();
          this.getUserRounds();
    })
    // .then(
    //   API.getStats(this.state.playerID)
    //   .then(data => console.log(data))
    //   .catch(e => console.log(e))
    // )
  }

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
  }

  getAllGameStats = () => {
    this.setState({stats: []});
    this.state.games.forEach((game, index) => {
      return this.getGameStats(index);
    });
    this.setState({avgRounds: this.state.rounds.length / this.state.stats.length});
  }

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
  }

  getGameStats = (index) => {
    const gameStats = {};
    this.state.games[index].rounds.forEach((round, rIndex) => {
      gameStats[`round_${rIndex}`] = this.getRoundStatsByGame(this.state.games[index], rIndex);
    });    
    let stats = [...this.state.stats, gameStats];
    this.setState({stats});
    this.setState({totalGames: this.state.stats.length});
  }

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
  }

  getUserRounds = () => {
    API.getRounds(this.state.playerID)
    .then(({ data })=> {
      this.setState({rounds: this.getRoundStatsByUser(data)});
      this.getMostMissed();
      //console.log(this.getRoundStatsByUser());
    });
  }

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
  }

  render() {    
    //Redirect to Login page if not logged in
    if (this.state.logIn) {
        return <Redirect to="/"/>;
    }
    return (
    <div>
      <Nav title="DataViz-Wiz"/>
      <Container>       
        <Jumbotron>
        <div className="row">
          <div className="col-sm-11">
          <h1 style={{textAlign:"center", marginTop: 0}}>Stats</h1>
          </div>
          </div>

          <div className="row">
            <div className="col-sm-2">
          <img alt="userImage" style={{width: 250}} src={this.state.imageUrl}/>
            </div>
            <div className="col-sm-2"></div>
            <div className="col-sm-8">
              <p style={{fontSize: 60, marginTop:40}}> {this.state.name} </p>
              {/* <p style={{fontSize: 30, marginTop:40}}> and maybe something else about them </p> */}
              </div>
          </div>


          <div className="row" style= {{ textAlign: "center",  }}>

          <div className="col-sm-3">
          <h2 style={{marginTop: 20}}> Total Games: 
          <p style={{marginTop: 40}}> {this.state.totalGames} </p>
          </h2>
          </div>

          <div className="col-sm-4">
          <h2 style={{marginTop: 20}}> Most Missed: <p style={{marginTop: 40}}> {this.state.mostMissed} </p>
            </h2>

          </div>

          <div className="col-sm-4">
          <h2 style={{marginTop: 20}}> Average Rounds per Game: <p style={{marginTop: 40}}> {this.state.avgRounds} </p>
            </h2>

          </div>

          </div>
        </Jumbotron>
      </Container>
    </div>
    );
  }
}

export default Stats;
