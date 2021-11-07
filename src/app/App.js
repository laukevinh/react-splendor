import React from "react";
import Game from "./Game";
import NavBar from "./NavBar";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.options = {
      NUM_OF_PLAYERS: [2, 3, 4],
      POINTS_TO_WIN: [15, 21]
    }
    this.defaults = {
      MIN_PLAYERS: 2,
      MIN_POINTS_TO_WIN: 15,
    }
    this.state = {
      numPlayers: this.defaults.MIN_PLAYERS,
      pointsToWin: this.defaults.MIN_POINTS_TO_WIN,
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
          options={this.options}
          defaults={this.defaults}
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