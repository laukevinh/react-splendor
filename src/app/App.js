import React from "react";
import Game from "./Game";
import NavBar from "./NavBar";
import { MIN_PLAYERS, MIN_POINTS_TO_WIN } from "../constants/defaults";
import GameBase from "../objects/GameBase";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      numPlayers: MIN_PLAYERS,
      pointsToWin: MIN_POINTS_TO_WIN,
      game: new GameBase(MIN_PLAYERS, MIN_POINTS_TO_WIN)
    }
    this.createNewGame = this.createNewGame.bind(this);
  }

  createNewGame(numPlayers, pointsToWin) {
    this.setState({
      numPlayers: numPlayers,
      pointsToWin: pointsToWin,
      game: new GameBase(numPlayers, pointsToWin),
    });
  }

  render() {
    const {
      numPlayers,
      pointsToWin,
      game
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
          game={game}
        />
      </>
    )
  }
}

export default App;