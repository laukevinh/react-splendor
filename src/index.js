import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import decks from './cards';
import Board from './board';
import Bank from './bank';
import { allNoblemen } from './noblemen';
import Noblemen, { ModalNoblemen } from './noblemen';
import Player, { PlayerBase } from './player';
import Wallet from './wallet';
import 'semantic-ui-css/semantic.min.css';
import { Grid, Card } from 'semantic-ui-react';
import ReturnCoinsModal from './returnCoinsModal';
import { calculateCharge, shuffle, WILD, DECK, BOARD, RESERVED } from './utils';

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.handleCollectCoins = this.handleCollectCoins.bind(this);
    this.handleReturnCoins = this.handleReturnCoins.bind(this);
    this.handleBuy = this.handleBuy.bind(this);
    this.handleReserve = this.handleReserve.bind(this);
    this.handleNoblemenSelection = this.handleNoblemenSelection.bind(this);
    let shuffledDecks = [
      shuffle(decks[0]),
      shuffle(decks[1]),
      shuffle(decks[2]),
    ];
    let cards = this.initCards(shuffledDecks);
    const maxCoins = {
      2:4,  // in 2 player game, bank carries max 4 coins per color
      3:5,
      4:7,
    };
    
    this.state = {
      history: [{
        cards: [Array(4), Array(4), Array(4)],
        players: this.initPlayers(props.numPlayers),
      }],
      players: this.initPlayers(props.numPlayers),
      currentPlayerIdx: 0,
      bankCoins: new Wallet(maxCoins[props.numPlayers]),
      returnCoinsModalOpen: false,
      stepNumber: 0,
      moveHistory: [null],
      historyReversed: false,
      cards: cards,
      decks: shuffledDecks,
      noblemen: this.initNoblemen(props.numPlayers),
      noblemenSelectionOpen: false,
      selectableNoblemen: [],
      numPlayers: props.numPlayers,
      pointsToWin: props.pointsToWin,
      maxReserve: 3,
      finished: false,
    };
  }

  initPlayers(numPlayers) {
    let players = Array(numPlayers);
    for (let i=0; i < numPlayers; i++) {
      players[i] = new PlayerBase("player" + i, i);
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

  initNoblemen(numPlayers) {
    return shuffle(allNoblemen).slice(0, numPlayers + 1);
  }

  handleCollectCoins(coins) {
    let players = this.state.players.slice(0, this.state.numPlayers + 1);
    let bankCoins = Object.assign({}, this.state.bankCoins);
    let playerCoins = players[this.state.currentPlayerIdx].coins;
    for (let color of Object.keys(coins)) {
      bankCoins[color] -= coins[color];
      playerCoins[color] += coins[color];
    }
    if (10 < playerCoins.sum()) {
      // trigger modal
      this.setState({
        players: players,
        bankCoins: bankCoins,
        returnCoinsModalOpen: true,
      });
    } else {
      this.setState({
        players: players,
        bankCoins: bankCoins,
      });
      this.handleEndTurn();
    }
  }

  handleReturnCoins(coins) {
    let players = this.state.players.slice(0, this.state.numPlayers + 1);
    let bankCoins = Object.assign({}, this.state.bankCoins);
    let playerCoins = players[this.state.currentPlayerIdx].coins;
    for (let color of Object.keys(coins)) {
      bankCoins[color] += coins[color];
      playerCoins[color] -= coins[color];
    }
    this.setState({
      players: players,
      bankCoins: bankCoins,
      returnCoinsModalOpen: false,
    });
    this.handleEndTurn();
  }

  handleBuy(source, level, column, index, card) {
    // todo upgrade: add sidebar where you can choose which coins to spend
    // todo BUG when you have consecutive handlebuy actions, sometimes the bankcoins go negative
    let players = this.state.players.slice(0, this.state.numPlayers + 1);
    let player = players[this.state.currentPlayerIdx];
    let playerWallet = player.coins;
    let playerCards = player.cards;
    let bankCoins = Object.assign({}, this.state.bankCoins);
    let { insufficientFunds, charge } = calculateCharge(card.price, playerWallet, playerCards);
    if (insufficientFunds) {
      alert("Insufficient Funds");
      return;
    }
    // remove coins from player wallet and put coins back into bank
    for (let [color, price] of Object.entries(charge)) {
      playerWallet[color] -= price;
      bankCoins[color] += price;
    }
    // add card and points to player
    playerCards[card.color].push(card);
    player.addPoints(card.points);
    // replace card on the board
    // TODO don't replace if there remaining deck is 0
    // TODO after buying from reserved, close all modals
    let cards = this.state.cards.slice();
    let decks = this.state.decks.slice();
    if (source === BOARD) {
      cards[level][column] = 0 < decks[level].length ? decks[level].pop() : null;
    } else if (source === RESERVED) {
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

  handleReserve(source, level, column, card) {
    let players = this.state.players.slice(0, this.state.numPlayers + 1);
    let player = players[this.state.currentPlayerIdx];
    let reserved = player.reserved;
    let bankCoins = Object.assign({}, this.state.bankCoins);
    if (this.state.maxReserve <= reserved.length) {
      alert("exceeds max allow reservations");
      return;
    }
    if (card === null) {
      return;
    }
    player.reserve(card);
    if (0 < bankCoins[WILD]) {
      player.coins[WILD]++;
      bankCoins[WILD]--;
    }
    // replace card on the board
    // TODO if source is top of deck don't replace
    let decks = this.state.decks.slice();  
    let cards = this.state.cards.slice();
    if (source === DECK) {
      decks[level].pop();
    } else {
      cards[level][column] = decks[level].pop();
    }
    this.setState({
      players: players,
      bankCoins: bankCoins,
      cards: cards,
      decks: decks,
    });
    if (10 < player.coins.sum()) {
      // trigger modal
      this.setState({ returnCoinsModalOpen: true });
    } else {
      this.handleEndTurn();
    }
  }

  rank(players) {
    return players.slice().sort((a, b) => b.points - a.points);
  }

  calculateWinner(playersRanked) {
    return this.state.pointsToWin <= playersRanked[0].points ? playersRanked[0] : null;
  }

  declareWinner(playersRanked) {
    let msg = playersRanked.map((player, idx) => {
      return `\n${idx+1}. ${player.name} ${player.points}`;
    })
    alert("Winner: \n" + msg);
  }

  displayRank(playersRanked) {
    return playersRanked.map((player, idx) => `\n${idx+1}. ${player.name} : ${player.points}`);
  }

  listSelectableNoblemen(player, noblemen) {
    let selectableNoblemen = noblemen.map(noble => {
      if (!noble.isDisplayed) {
        return false;
      } else {
        for (let color of Object.keys(noble.price)) {
          if (player.cards[color].length < noble.price[color]) {
            return false;
          }
        }
      }
      return true;
    });

    return selectableNoblemen;
  }

  handleNoblemenSelection(nobleIndex) {
    // player adds noblemen
    // after picking up noblemen, replace with stub so the placement is still the same
    const { currentPlayerIdx, numPlayers } = this.state;
    let players = this.state.players.slice();
    let player = players[currentPlayerIdx];
    let noblemen = this.state.noblemen.slice();
    let noble = noblemen[nobleIndex];
    noble.isDisplayed = false;
    player.addNoble(noble);
    player.addPoints(noble.points);
    this.setState({
      players: players,
      noblemen: noblemen,
      selectableNoblemen: [],
      noblemenSelectionOpen: false,
    });
    this.handleWinner(players, currentPlayerIdx, numPlayers);
    this.handleNextTurn(currentPlayerIdx, numPlayers);
  }

  handleWinner(players, currentPlayerIdx, numPlayers) {
    if (currentPlayerIdx + 1 === numPlayers) {  // check for winner at end of round
      const playersRanked = this.rank(players);
      const winner = this.calculateWinner(playersRanked);
      if (winner) {
        this.setState({ finished: true });
        alert(this.displayRank(playersRanked));
      }
    }
  }

  handleNextTurn(currentPlayerIdx, numPlayers) {
    if (!this.state.finished) { // next player if game not finished
      this.setState({ currentPlayerIdx: (currentPlayerIdx + 1) % numPlayers });
    }
  }
  
  any(array) {
    for (let each of array) {
      if (each === true) {
        return true;
      }
    }
    return false;
  }

  handleEndTurn() {
    // qualify for nobleman?
    // toggle modal open -> let modal handle real end turn
    // no -> real end turn
    const { players, noblemen, currentPlayerIdx, numPlayers } = this.state;
    const player = players[currentPlayerIdx];
    // TODO: BUG: if you qualify for 1 nobleman, you don't need to invest further to get the second... 
    // might only be a problem now because noblement aren't unique.
    const selectableNoblemen = this.listSelectableNoblemen(player, noblemen);
    if (this.any(selectableNoblemen)) {
      this.setState({
        noblemenSelectionOpen: true,
        selectableNoblemen: selectableNoblemen,
      });
    } else {
      this.setState({ selectableNoblemen: [] });
      this.handleWinner(players, currentPlayerIdx, numPlayers);
      this.handleNextTurn(currentPlayerIdx, numPlayers);
    }
  }

  render() {
    const { history, moveHistory, cards, decks, noblemen, noblemenSelectionOpen, selectableNoblemen, currentPlayerIdx, numPlayers, finished } = this.state;
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
    let status;
    if (finished) {  // check for winner at end of round
      const playersRanked = this.rank(this.state.players);
      status = "Game Over:\n" + this.displayRank(playersRanked);
    } else {
      status = "Next player: " + this.state.players[currentPlayerIdx].name;
    }

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
            <ReturnCoinsModal
              coins={this.state.players[currentPlayerIdx].coins}
              open={this.state.returnCoinsModalOpen}
              handleReturnCoins={this.handleReturnCoins}
            />
          </Grid.Column>
          <Grid.Column width={6} className="game-board">
            <Grid.Row>
              <Noblemen noblemen={noblemen}/>
            </Grid.Row>
            <Grid.Row>
              <ModalNoblemen
                noblemen={noblemen}
                selectableNoblemen={selectableNoblemen}
                handleNoblemenSelection={this.handleNoblemenSelection}
                open={noblemenSelectionOpen}
              />
            </Grid.Row>
            <Grid.Row>
              <Board 
                cards={cards}
                decks={decks}
                playerWallet={this.state.players[currentPlayerIdx].coins}
                playerCards={this.state.players[currentPlayerIdx].cards}
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
