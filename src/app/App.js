import React from "react";
import Game from "./Game";
import NavBar from "./NavBar";
import { MIN_PLAYERS, MIN_POINTS_TO_WIN } from "../constants/defaults";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      numPlayers: MIN_PLAYERS,
      pointsToWin: MIN_POINTS_TO_WIN,
      isNewGame: false
    }
    this.createNewGame = this.createNewGame.bind(this);
    this.setIsNewGame = this.setIsNewGame.bind(this);
  }

  createNewGame(numPlayers, pointsToWin) {
    this.setState({
      numPlayers: numPlayers,
      pointsToWin: pointsToWin,
      isNewGame: true
    });
  }

  setIsNewGame(bool) {
    this.setState({
      isNewGame: bool
    });
  }

  render() {
    const {
      numPlayers,
      pointsToWin,
      isNewGame
    } = this.state;

    return (
      <>
        <NavBar
          numPlayers={numPlayers}
          pointsToWin={pointsToWin}
          createNewGame={this.createNewGame}
        />
        <Game
          numPlayers={numPlayers}
          pointsToWin={pointsToWin}
          isNewGame={isNewGame}
          setIsNewGame={this.setIsNewGame}
        />
      </>
    )
  }
}

export default App;