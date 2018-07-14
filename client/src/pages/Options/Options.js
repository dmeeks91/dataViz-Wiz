import React, { Component } from "react";
import {Redirect} from "react-router-dom";
import { db, joinGame, startGame }from "../../utils";
import Collapsible from 'react-collapsible';
import Nav from "../../components/Nav";
import { Container } from "../../components/Grid";
import Modal from "react-responsive-modal";
import gameTypes from "../../gameTypes.json";
import { Button } from "react-bootstrap";
import { toast } from 'react-toastify';
import "./Options.css";


class Options extends Component {

    state = {
      open: false,
      options: [],
      playerID: "",
      playerName:"",
      play: false
    };
    
    closeModal = () => {
      this.setState({ open: false });
    };
    
    onJoinedGame = (game) => {
      //console.log(game);
      if (game.players.length === 1 && game.type === 1)
      {
        toast.info(`Waiting for another person to join your game`,{
          autoClose: false
        });
      }
      else if (game.players.length === 2)
      {
        const other = game.players.map(player=>player.name)
                          .filter(player => player.name !== this.state.playerName)[0];
        toast.success(`Your game against ${other} begins now`);
        //startGame(game,this.onGameStarted);
      }
      
      startGame(game,this.onGameStarted);
    };

    onGameStarted = (game) => {
      toast.dismiss();
      db.table('userProfile')
        .update(this.state.playerID,{game})
        .then(()=>{
          if (game.type === 0) this.setState({play:true})
        });
      
    };

    setModal = () => {
      this.setState({
        open: true
      })
    };  

    saveTime (gameType, option) {   
      console.log('SavingTime');     
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
      const { open } = this.state;

      if (this.state.play) {
          return <Redirect to="/play"/>;
      }

      return(
        <div>
          <Nav title="DataViz-Wiz"/>
          <Container>       
            <div className="card">
              <Collapsible transitionTime={150} trigger="Time Trial" style={{margin: 100}}> <Button bsStyle="primary" style={{margin: 10}} onClick = {()=>this.setModal()}> How to play? </Button>
                <Modal open={open} onClose={this.closeModal} center>
                  <div>
                    <h1> Click on the matching symbols and select the correct name. Get as many as you can before time runs out! </h1>
                  </div>
                </Modal>
                {/* <Link to="/play"> */}
                  {this.state.options}
                {/* </Link> */}
              </Collapsible>
            </div>
            <div className="card">
              <Collapsible transitionTime={150} trigger="Versus" style={{margin: 100}}>
                <Button
                 bsStyle="primary"
                 onClick={() => this.saveTime(1,30)}
                >Join Game</Button>
              </Collapsible>
            </div>
          </Container>
        </div>   
      );
    };
}

export default Options;
