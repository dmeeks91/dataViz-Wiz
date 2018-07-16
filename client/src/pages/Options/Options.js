import React, { Component } from "react";
import {Redirect} from "react-router-dom";
import { db, joinGame, startGame }from "../../utils";
import Collapsible from 'react-collapsible';
import Nav from "../../components/Nav";
import GameOptions from "../../components/GameOptions";
import { Container } from "../../components/Grid";
import gameTypes from "../../gameTypes.json";
import { Button } from "react-bootstrap";
import { toast } from 'react-toastify';
import API from "../../utils/API";
import "./Options.css";


class Options extends Component {

    state = {
      games: [],
      inGame: false,
      options: [],
      playerID: "",
      playerName:"",
      play: false,
      toastID: null
    };
    
    onJoinedGame = (game) => {
      // console.log(game);
      if (game.players.length === 1 && game.type === 1)
      {
        toast.dismiss();
        toast.info(`Game Created, waiting for another person to join`,{
          autoClose: false
        });
      }
      else if (game.players.length === 2)
      {     
        toast.dismiss();   
        toast.info(`We found a game for you to play!`,{
          autoClose: false
        });
      }      
      startGame(game,this.onGameStarted);
    };

    onGameStarted = (game) => {      
      db.table('userProfile')
        .update(this.state.playerID,{game})
        .then(()=>{
          if (game.type === 0) 
          {
            this.setState({play:true});
          }
          else
          {
            toast.dismiss();
            const other = game.players.filter(({id}) => id !== this.state.playerID)
                              .map(player=>player.name)[0];
            toast.success(`Your game against ${other} begins now!`,{
              autoClose: false
            });
            setTimeout(() => {
              toast.dismiss();
              this.setState({play:true})
            },2000);
          }
        });
      
    };

    saveTime (gameType, option) {      
      db.table('userProfile')
        .update(this.state.playerID,{timeInterval: option});
      
      if (!this.state.inGame)
      {        
        joinGame({
          option,
          playerID: this.state.playerID,
          playerName: this.state.playerName,
          type: gameType
        }, this.onJoinedGame);
        this.setState({inGame:true});
      }
      
    };

    componentDidMount() {  
      db.table('userProfile')
        .toArray()
        .then(profile => {
          //redirect to login screen if not logged in
          if (!profile.length) 
          {
            this.setState({ logIn: true });
          }
          else
          {
            this.setState({
              playerID: profile[0].id,
              playerName: profile[0].firstName
            });
            this.getGamesPlayed();
          }
        });  

    };

    getGamesPlayed() {
      API.getGames(this.state.playerID)
        .then(({data})=> {
          const games = data.filter(({type}) => type === 0); 
          this.setState({games});
          this.getGameTypes();
        });
    };

    getGameTypes() {
      const gameOptions = gameTypes[0].options           
      const options = Object.keys(gameOptions).map((key, index) =>{
        //console.log(gameOptions[index]);
        const optRecord = this.getMostMatches(gameOptions[index]);
        return (
          { 
            key: gameOptions[key],
            click: () => this.saveTime(gameTypes[0].id,gameOptions[index]),
            style: {textDecorationLine: "none"},
            text: `${gameOptions[index]} seconds`,
            best: optRecord
          }
        )
      });
  
      this.setState({options});
    };

    getMostMatches(opt) {
      const matches = this.state.games.map(game => {
        return game.rounds[0].guesses.filter(({isMatch})=>{
          return (isMatch && game.option === opt)
        }).length;
      });

      //console.log(matches);

      // console.log(Math.max(...matches));

      return Math.max(...matches)
    };

    render() {

      if (this.state.play) {
          return <Redirect to="/play"/>;
      }

      return(
        <div>
          <Nav title="DataViz-Wiz"/>
          <Container>                  
            <div className="card">
              <div className="card-header instrHeader">Match and name as many as you can before time runs out!</div>            
              <div className="card-body">
                <Collapsible transitionTime={150} trigger="Single Player" style={{margin: 100}}> 
                    <GameOptions options={this.state.options}/>
                </Collapsible>
                <Collapsible transitionTime={150} trigger="Versus" style={{margin: 100}}>
                  <Button
                  bsStyle="primary"
                  onClick={() => this.saveTime(1,30)}
                  >Join Game</Button>
                </Collapsible>
              </div>
            </div>
          </Container>
        </div>   
      );
    };
}

export default Options;
