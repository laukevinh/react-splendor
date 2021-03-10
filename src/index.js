import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import decks from './cards';
import Bank from './bank';
import Noblemen from './noblemen';
import Player from './player';
import Wallet from './wallet';
import 'semantic-ui-css/semantic.min.css';
import { Grid, Card } from 'semantic-ui-react';

function calculateWinner(players) {
  let hiscore = 0;
  let winner = null;
  for (let i = 0; i < players.length; i++) {
    if (21 < players[i].score && hiscore <= players[i].score) {
      hiscore = players[i].score;
      winner = players[i];
    }
  }
  return winner;
}

class Board extends React.Component {
  renderPrice(price) {
    let colorMap = ['white', 'blue', 'green', 'red', 'black'];
    let prices = [];
    for (let i = 0; i < price.length; i++) {
      if (price[i] > 0) {
        prices.push(
          <Grid.Row>
            <span >{colorMap[i]}</span>
            <span >{price[i]}</span>
          </Grid.Row>
        );
      }
    }
    return (prices);
  }
  
  renderCard(i, color, points, price) {
    const prices = this.renderPrice(price);
    return (
      <Card onClick={() => this.props.onClick(i)}>
        <Card.Content className={color}>
          <Card.Header>
            <span className="leftHeader">{color}</span>
            <span className="rightHeader">{points}</span>
          </Card.Header>
          <Card.Description>{prices}</Card.Description>
        </Card.Content>
      </Card>
    );
  }

  render() {
    let decks = this.props.decks;
    
    let rows = [];
    for (let i = 0; i < 3; i++) {
      let cols = [];
      for (let j = 0; j < 4; j++) {
        let index = i * 4 + j;
        let card = decks[i].pop();
        let color = card[0];
        let points = card[1];
        let price = card.slice(2,);
        cols.push(this.renderCard(index, color, points, price));
      }
      rows.push(
        <Card.Group itemsPerRow={4}>{cols}</Card.Group>
      );
    }
    return (
      <div>{rows}</div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.handleCollectCoins = this.handleCollectCoins.bind(this);
    this.state = {
      history: [{
        cards: [Array(4), Array(4), Array(4)],
        players: this.initPlayers(props.numPlayers),
      }],
      players: this.initPlayers(props.numPlayers),
      currentPlayerIdx: 0,
      bankCoins: Wallet(true, props.numPlayers),
      stepNumber: 0,
      moveHistory: [null],
      historyReversed: false,
      xIsNext: true,
      cards: [Array(4), Array(4), Array(4)],
      decks: [
        this.shuffle(decks[0]),
        this.shuffle(decks[1]),
        this.shuffle(decks[2]),
      ],
      numPlayers: props.numPlayers,
    };
  }

  initPlayers(numPlayers) {
    let players = Array(numPlayers);
    for (let i=0; i < numPlayers; i++) {
      players[i] = {
        coins: Wallet(false, numPlayers),
        cards: [],
        reserved: [],
        points: 0,
        noblemen: [],
        playerName: "player" + i,
      };
    }
    return players;
  }

  shuffle(A) {
    function randInt(i, j) {
      return Math.floor(Math.random() * (j - i) + i);
    }
    function swap(A, i, j) {
      let temp = A[i];
      A[i] = A[j];
      A[j] = temp;
    }
    let n = A.length;
    for (let k = 0; k < n; k++) {
      swap(A, k, randInt(0, n - 1));
    }
    return A;
  }

  handleCollectCoins(coins) {
    let players = this.state.players.slice(0, this.state.numPlayers + 1);
    let bankCoins = Object.assign({}, this.state.bankCoins);
    let playerCoins = players[this.state.currentPlayerIdx].coins;
    for (let color of Object.keys(coins)) {
      bankCoins[color] -= coins[color];
      playerCoins[color] += coins[color];
    }
    this.setState({
      players: players,
      bankCoins: bankCoins,
      currentPlayerIdx: (this.state.currentPlayerIdx + 1) % this.state.numPlayers,
    });
  }

  handleCardClick(i) {
    alert(i);
  }

  render() {
    const history = this.state.history;
    const moveHistory = this.state.moveHistory;
    const current = history[this.state.stepNumber];
    const players = Object.values(this.state.players).map((player) => {
      return <Player {...player} />;
    });
    const winner = calculateWinner(players);

    let moves = history.map((step, move) => { //move is the index
      const col = moveHistory[move] % 3;
      const row = Math.floor(moveHistory[move] / 3);
      const desc = move ?
        "Go to move #" + move + " (" + col + ", " + row + ")" :
        "Go to game start";
      return (
        <li key={move}>
          <button 
            className={(move === this.state.stepNumber) ? "bold" : ""}
          >
            {desc}
          </button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = "Winner: " + winner.token;
    } else if (this.state.stepNumber > 8) {
      status = "Cat's game!";
    } else {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    }

    return (
      <Grid>
          <Grid.Column width={3} className="players">
            {players}
          </Grid.Column>
          <Grid.Column width={1} className="bank">
            <Bank 
              coins={this.state.bankCoins}
              handleCollectCoins={this.handleCollectCoins}
            />
          </Grid.Column>
          <Grid.Column width={7} className="game-board">
            <Grid.Row>
              <Noblemen />
            </Grid.Row>
            <Grid.Row>
              <Board 
                squares={current.squares}
                cards={current.cards}
                winner={winner}
                decks={this.state.decks}
                onClick={(i) => this.handleCardClick(i)}
              />
            </Grid.Row>
          </Grid.Column>
          <Grid.Column width={3} className="game-info">
            <div>{status}</div>
            <ol>{moves}</ol>
          </Grid.Column>
      </Grid>
    ); // is the entire ordered list of moves getting re-rendered? or only what has changed?
  }
}

// ========================================

ReactDOM.render(
  <Game numPlayers={2}/>,
  document.getElementById('root')
);
