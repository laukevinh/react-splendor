import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import decks from './cards';
import Board from './board';
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

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.handleCollectCoins = this.handleCollectCoins.bind(this);
    let shuffledDecks = [
      this.shuffle(decks[0]),
      this.shuffle(decks[1]),
      this.shuffle(decks[2]),
    ];
    let cards = this.initCards(shuffledDecks);
    
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
      cards: cards,
      decks: shuffledDecks,
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

  initCards(decks) {
    let cards = Array(3);
    for (let i=0; i < cards.length; i++) {
      let row = Array(4);
      for (let j=0; j < row.length; j++) {
        row[j] = decks[i].pop();
      }
      cards[i] = row;
    }
    return cards;
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

  handleBuy(card, price) {
    // price is a 5 element array
    // player.cards will be [[], [], ..., []]
    // todo upgrade: add sidebar where you can choose which coins to spend
    const players = this.state.players.slice(0, this.state.numPlayers + 1);
    const player = players[this.state.currentPlayerIdx];
    let playerWallet = player.coins;
    let playerCards = player.cards;
    let charge = Array(5).fill(0);
    for (let i=0; i<price.length; i++) {
      let remainder = price[i] - player.cards[i].length;
      if (playerWallet[i] + playerWallet[5] < remainder) {
        alert("insufficient funds");
        return;
      } else if (playerWallet[i] < remainder) {
        charge[i] = playerWallet[i];
        charge[5] += remainder - playerWallet[i];
      } else {
        charge[i] = remainder;
      }
      if (playerWallet[5] - charge[5] < 0) {
        return;
      }
    }
    // remove coins from player wallet
    for (let i=0; i < charge.length; i++) {
      playerWallet[i] -= charge[i];
    }
    // add card to player cards
    playerCards[card.color].push(card);
    // replace card on the board
  }

  handleCardClick(i) {
    alert(i);
  }

  render() {
    const history = this.state.history;
    const moveHistory = this.state.moveHistory;
    const current = history[this.state.stepNumber];
    const cards = this.state.cards;
    const decks = this.state.decks;
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
                cards={cards}
                winner={winner}
                decks={decks}
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
