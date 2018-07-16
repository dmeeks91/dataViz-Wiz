import React, { Component } from "react";
import {Redirect} from "react-router-dom";
import { db, joinGame, startGame }from "../../utils";
import Collapsible from 'react-collapsible';
import Nav from "../../components/Nav";
import { Container } from "../../components/Grid";
import gameTypes from "../../gameTypes.json";
import { Button } from "react-bootstrap";
import { toast } from 'react-toastify';
import "./Options.css";


class Options extends Component {

    state = {
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
        toast.info(`Game Created, waiting for another person to join`,{
          autoClose: false
        });
      }
      else if (game.players.length === 2)
      {        
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
      //console.log('SavingTime');     
      db.table('userProfile')
        .update(this.state.playerID,{timeInterval: option});
      joinGame({
        option,
        playerID: this.state.playerID,
        playerName: this.state.playerName,
        type: gameType
      }, this.onJoinedGame);
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
            })
            this.getGameTypes();
          }
        });  

    };

    getGameTypes() {
      // console.log(gameTypes[0].options)
      const gameOptions = gameTypes[0].options
      const options = Object.keys(gameOptions).map((key, index) =>{
        return (
          <Button className="col-sm-2 subbtn" 
            key={gameOptions[key]}
            style={{textDecorationLine: "none"}}
            block
            onClick={() => this.saveTime(gameTypes[0].id,gameOptions[index])}
          >{`${gameOptions[index]} seconds`}</Button>
        )
      });
  
      this.setState({options});
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
                    {this.state.options}
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
