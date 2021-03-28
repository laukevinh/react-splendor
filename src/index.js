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

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.handleCollectCoins = this.handleCollectCoins.bind(this);
    this.handleBuy = this.handleBuy.bind(this);
    this.handleReserve = this.handleReserve.bind(this);
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
      cards: cards,
      decks: shuffledDecks,
      numPlayers: props.numPlayers,
      pointsToWin: props.pointsToWin,
      maxReserve: 3,
      finished: false,
    };
  }

  initPlayers(numPlayers) {
    let players = Array(numPlayers);
    for (let i=0; i < numPlayers; i++) {
      players[i] = {
        coins: Wallet(false, numPlayers),
        cards: {
          'white': [],
          'blue': [],
          'green': [],
          'red': [],
          'black': [],
        },
        reserved: [],
        points: 0,
        noblemen: [],
        playerName: "player" + i,
        position: i,
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
    });
    this.handleEndTurn();
  }

  handleBuy(source, level, column, index, card) {
    // todo upgrade: add sidebar where you can choose which coins to spend
    let players = this.state.players.slice(0, this.state.numPlayers + 1);
    let player = players[this.state.currentPlayerIdx];
    let playerWallet = player.coins;
    let playerCards = player.cards;
    let bankCoins = Object.assign({}, this.state.bankCoins);
    let charge = Wallet(false);
    for (let [color, price] of Object.entries(card.price)) {
      let remainder = price - player.cards[color].length;
      if (playerWallet[color] + playerWallet['wild'] < remainder) {
        alert("insufficient funds");
        return;
      } else if (playerWallet[color] < remainder) {
        charge[color] = playerWallet[color];
        charge['wild'] += remainder - playerWallet[color];
      } else {
        charge[color] = remainder;
      }
      if (playerWallet['wild'] - charge['wild'] < 0) {
        return;
      }
    }
    // remove coins from player wallet and put coins back into bank
    for (let [color, price] of Object.entries(charge)) {
      playerWallet[color] -= price;
      bankCoins[color] += price;
    }
    // add card and points to player
    playerCards[card.color].push(card);
    player.points += card.points;
    // replace card on the board
    let cards = this.state.cards.slice();
    let decks = this.state.decks.slice();
    if (source === "board") {
      cards[level][column] = decks[level].pop();
    } else if (source === "reserved") {
      player.reserved.splice(index, 1);
    }
    this.setState({
      players: players,
      bankCoins: bankCoins,
      cards: cards,
      decks: decks,
    })
    this.handleEndTurn();
  }

  handleReserve(level, column, card) {
    let players = this.state.players.slice(0, this.state.numPlayers + 1);
    let player = players[this.state.currentPlayerIdx];
    let reserved = player.reserved;
    let bankCoins = Object.assign({}, this.state.bankCoins);
    if (this.state.maxReserve <= reserved.length) {
      alert("exceeds max allow reservations");
      return;
    }
    player.reserved.push(card);
    if (0 < bankCoins['wild']) {
      player.coins['wild']++;
      bankCoins['wild']--;
    }
    // replace card on the board
    let cards = this.state.cards.slice();
    let decks = this.state.decks.slice();
    cards[level][column] = decks[level].pop();
    this.setState({
      players: players,
      bankCoins: bankCoins,
      cards: cards,
      decks: decks,
    });
    this.handleEndTurn();
  }

  rank(players) {
    return players.slice().sort((a, b) => b.points - a.points);
  }

  calculateWinner(playersRanked) {
    return this.state.pointsToWin <= playersRanked[0].points ? playersRanked[0] : null;
  }

  declareWinner(playersRanked) {
    let msg = playersRanked.map((player, idx) => {
      return `\n${idx+1}. ${player.playerName} ${player.points}`;
    })
    alert("Winner: \n" + msg);
  }

  displayRank(playersRanked) {
    return playersRanked.map((player, idx) => `\n${idx+1}. ${player.playerName} : ${player.points}`);
  }

  handleEndTurn() {
    const { players, currentPlayerIdx, numPlayers } = this.state;
    if (currentPlayerIdx + 1 === numPlayers) {  // check for winner at end of round
      const playersRanked = this.rank(players);
      const winner = this.calculateWinner(playersRanked);
      if (winner) {
        this.setState({ finished: true });
        alert(this.displayRank(playersRanked));
      }
    }
    if (!this.state.finished) { // next player if game not finished
      this.setState({ currentPlayerIdx: (currentPlayerIdx + 1) % numPlayers });
    }
  }

  render() {
    const { history, moveHistory, cards, decks, currentPlayerIdx, finished } = this.state;
    const current = history[this.state.stepNumber];
    const players = Object.values(this.state.players).map((player) => {
      return (
        <Player 
          {...player}
          activePlayer={player.position === currentPlayerIdx}
          finished={finished}
          handleBuy={this.handleBuy}
        />
      );
    });
    const playersRanked = this.rank(this.state.players);
    const winner = this.calculateWinner(playersRanked);

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
      status = "Game Over:\n" + this.displayRank(playersRanked);
    } else {
      status = "Next player: " + this.state.players[currentPlayerIdx].playerName;
    }
    
    return (
      <Grid padded={true}>
          <Grid.Column width={4} className="game-players">
            {players}
          </Grid.Column>
          <Grid.Column width={1} className="game-bank">
            <Bank 
              coins={this.state.bankCoins}
              handleCollectCoins={this.handleCollectCoins}
              finished={finished}
            />
          </Grid.Column>
          <Grid.Column width={6} className="game-board">
            <Grid.Row>
              <Noblemen />
            </Grid.Row>
            <Grid.Row>
              <Board 
                cards={cards}
                winner={winner}
                decks={decks}
                handleBuy={this.handleBuy}
                handleReserve={this.handleReserve}
                finished={finished}
              />
            </Grid.Row>
          </Grid.Column>
          <Grid.Column width={1} className="game-info">
            <div>{status}</div>
            <ol>{moves}</ol>
          </Grid.Column>
      </Grid>
    ); // is the entire ordered list of moves getting re-rendered? or only what has changed?
  }
}

// ========================================

ReactDOM.render(
  <Game numPlayers={2} pointsToWin={3} />,
  document.getElementById('root')
);
