import React, { Component } from "react";
import gameTypes from "../../gameTypes.json";
import {Redirect} from "react-router-dom";
import StatTable from "../../components/StatTable";
import Nav from "../../components/Nav";
import { db } from "../../utils";
import API from "../../utils/API";
import "./Stats.css";


class Stats extends Component {
  state = {
    imageUrl: "",
    name: "",
    logIn: false,
    playerID: "",
    myGames: {0:[],1:[]},
    allGames: {0:[],1:[]},
    height: 0,
    stats: null,
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
              this.getGamesPlayed();
              // this.getGames();
              // this.getUserRounds();
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

  getGamesPlayed() {
    //get all games from Mongo for the current player
    API.getGames(this.state.playerID)
      .then(({data})=> {
        const myGames = {
          0: data.filter(({type}) => type === 0),
          1: data.filter(({type}) => type === 1)
        };
        this.setState({myGames});

        //Get all games in mongo
        API.getGames("all")
        .then(({data})=> {
          const allGames = {
            0: data.filter(({type}) => type === 0),
            1: data.filter(({type}) => type === 1)
          };
          this.setState({allGames});
          this.getStatTableRows();
        });
      });        
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

  getStatTableRows = () => {
    //Get Games Played Stat Rows
    const gameOptions = gameTypes[0].options;
    const gamesPlayed = Object.keys(gameOptions).map((a) =>{
      const key = `Single Player (${gameOptions[a]}sec)`,
       val = this.state.myGames[0].filter(game => game.option === gameOptions[a]).length;
       return {key, val};
    });

    gamesPlayed.push({key:"Versus", val: this.state.myGames[1].length});

    //Get Best Score Rows
    const bestScore = Object.keys(gameOptions).map((a) =>{
      const key = `Single Player (${gameOptions[a]}sec)`,
       val = this.getBestScore(this.state.myGames[0].filter(game => game.option === gameOptions[a]));
       return {key, val};
    });

    bestScore.push({key:"Versus", val:this.getBestScore(this.state.myGames[1])})

    //Get Average Score Rows
    const avgScore = Object.keys(gameOptions).map((a) =>{
      const key = `Single Player (${gameOptions[a]}sec)`,
       val = this.getAvgScore(this.state.myGames[0].filter(game => game.option === gameOptions[a]));
       return {key, val};
    });

    avgScore.push({key:"Versus", val:this.getAvgScore(this.state.myGames[1])});

    this.setState({
      stats: {gamesPlayed, bestScore, avgScore}
    })
  };

  getAvgScore = (games) => {
    const matches = games.map(game => {
      return game.rounds[0].guesses.filter(({isMatch})=>{
        return (isMatch)
      }).length;
    });
    //console.log(matches);
    const average = (!matches.length) ? 0 : matches.reduce((a,b)=>a+b)/matches.length;
    //console.log(avg);
    return average.toFixed(1);
  };

  getBestScore = (games) => {
    const matches = games.map(game => {
      return game.rounds[0].guesses.filter(({isMatch})=>{
        return (isMatch)
      }).length;
    });
    
    return (matches.length) ? Math.max(...matches) : 0;
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
      <div className="container" style={{height:this.state.height}}>    
        <div className="card statCard">  
          <div id="name" className="card-header">{this.state.name}</div>   
          <div className="card-body">
            <img id="usrImg" alt="userImage" src={this.state.imageUrl}/>
          </div>
        </div>
        <div className="card statCard">
          <div className="card-header">Your Stats</div>
          <div className="card-body">
            {(this.state.stats != null) ?
            <StatTable header="Games Played" 
              rows = {this.state.stats.gamesPlayed}
            /> : 
            <StatTable header="Games Played" rows={[
              {key:"Single Player", val: 0},
              {key:"Versus", val: 0}
            ]}/>}
            {(this.state.stats != null) ?
            <StatTable header="Best Score" 
              rows = {this.state.stats.bestScore}
            /> : 
            <StatTable header="Best Score" rows={[
              {key:"Single Player", val: 0},
              {key:"Versus", val: 0}
            ]}/>}
            {(this.state.stats != null) ?
            <StatTable header="Average Score" 
              rows = {this.state.stats.avgScore}
            /> : 
            <StatTable header="Average Score" rows={[
              {key:"Single Player", val: 0},
              {key:"Versus", val: 0}
            ]}/>}
          </div>
        </div> 
        <div className="card statCard">
          <div className="card-header">Leader Board</div>
          <div className="card-body">              
            <StatTable header="Most in 30sec" 
              rows={[
                {key:"Single Player", val: 2},
                {key:"Versus", val: 4}
              ]}
            />
            <StatTable header="Best Accuracy" 
              rows={[
                {key:"Single Player", val: 2},
                {key:"Versus", val: 4}
              ]}
            />
          </div>
        </div>     
      </div>
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
