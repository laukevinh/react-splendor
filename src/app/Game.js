import Board from '../components/Board';
import Bank from '../components/Bank';
import Noblemen, { ModalNoblemen } from '../components/Noblemen';
import Player from '../components/Player';
import { Grid, Container, Divider } from 'semantic-ui-react';
import ReturnCoinsModal from '../components/ReturnCoinsModal';
import { calculateCharge, WILD, DECK, BOARD, RESERVED, any, rank } from '../utils';
import React from 'react';
import History from '../components/History';
import DesktopLayout from '../layouts/desktop';
import { MAX_PLAYER_COINS, MAX_PLAYER_RESERVATION } from '../constants/defaults';
import BankBase from '../objects/BankBase';

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.handleCoinTransaction = this.handleCoinTransaction.bind(this);
    this.handleBuy = this.handleBuy.bind(this);
    this.handleReserve = this.handleReserve.bind(this);
    this.handleNoblemenSelection = this.handleNoblemenSelection.bind(this);

    this.state = {
      game: props.game,
      numPlayers: props.game.numPlayers,
      pointsToWin: props.game.pointsToWin,
      players: props.game.players,
      currentPlayerIdx: props.game.currentPlayerIdx,
      bank: props.game.bank,
      decks: props.game.decks,
      board: props.game.board,
      nobles: props.game.nobles,
      status: props.game.status,
      lifecycle: props.game.stateMachine.startOfTurn,
      finished: false,
      returnCoinsModalOpen: false,
      noblemenSelectionOpen: false,
      selectableNoblemen: [],
    };
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.game !== prevProps.game) {
      this.setState((state, props) => {
        return {
          game: props.game,
          numPlayers: props.game.numPlayers,
          pointsToWin: props.game.pointsToWin,
          players: props.game.players,
          currentPlayerIdx: props.game.currentPlayerIdx,
          bank: props.game.bank,
          decks: props.game.decks,
          board: props.game.board,
          nobles: props.game.nobles,
          status: props.game.status,
          lifecycle: props.game.stateMachine.startOfTurn,
          finished: false,
          returnCoinsModalOpen: false,
          noblemenSelectionOpen: false,
          selectableNoblemen: [],
        }
      });
    } else if (this.state.lifecycle !== prevState.lifecycle) {
      if (this.state.lifecycle.description === 'returnCoins') {
        this.setState({
          returnCoinsModalOpen: true
        });
      } else if (this.state.lifecycle.description === 'selectNoble') {
        const selectableNoblemen = this.listSelectableNoblemen(this.state.players[this.state.currentPlayerIdx], this.state.nobles);
        if (any(selectableNoblemen)) {
          this.setState({
            noblemenSelectionOpen: true,
            selectableNoblemen: selectableNoblemen
          });
        } else {
          this.setState({
            lifecycle: this.state.lifecycle.endOfTurn
          });
        }
      } else if (this.state.lifecycle.description === 'endOfTurn') {
        this.handleEndTurn();
      } else if (this.state.lifecycle.description === 'endOfRound') {
        this.handleEndRound();
      } else if (this.state.lifecycle.description === 'endOfGame') {
        this.handleEndGame();
      }
    }
  }

  handleCoinTransaction(transactionAmountWallet, isPlayerCollecting) {
    let lifecycle = this.state.lifecycle;
    console.log("current state: ", lifecycle.description, lifecycle);
    if (lifecycle.collectCoins === undefined && lifecycle.returnCoins === undefined && lifecycle.description !== 'returnCoins') {
      console.log("Cannot collect or return coins in current lifecycle state: ", lifecycle);
      return;
    }
    if (isPlayerCollecting) {
      lifecycle = lifecycle.collectCoins;
    }
    let players = this.state.players.slice();
    let bank = new BankBase();
    Object.assign(bank.wallet, this.state.bank.wallet);
    let player = players[this.state.currentPlayerIdx];
    for (let color of Object.keys(transactionAmountWallet)) {
      if (isPlayerCollecting) {
        bank.wallet[color] -= transactionAmountWallet[color];
        player.coins[color] += transactionAmountWallet[color];
      } else {
        bank.wallet[color] += transactionAmountWallet[color];
        player.coins[color] -= transactionAmountWallet[color];
      }
    }

    if (MAX_PLAYER_COINS < player.coins.sum()) {
      this.setState({
        players: players,
        bank: bank,
        lifecycle: lifecycle.returnCoins,
      });
    } else {
      this.setState({
        players: players,
        bank: bank,
        lifecycle: lifecycle.selectNoble,
        returnCoinsModalOpen: false
      });
    }
  }

  handleBuy(source, level, column, index, card) {
    // todo upgrade: add sidebar where you can choose which coins to spend
    // todo BUG when you have consecutive handlebuy actions, sometimes the bankcoins go negative
    let lifecycle = this.state.lifecycle;
    console.log("current state: ", lifecycle.description, lifecycle);
    if (lifecycle.buyFromBoard === undefined && lifecycle.buyFromReservation === undefined) {
      console.log("Cannot buy in current lifecycle state: ", lifecycle);
      return;
    }
    let players = this.state.players.slice(0, this.state.numPlayers + 1);
    let player = players[this.state.currentPlayerIdx];
    let playerWallet = player.coins;
    let playerCards = player.cards;
    let bank = new BankBase();
    Object.assign(bank.wallet, this.state.bank.wallet);
    let { insufficientFunds, charge } = calculateCharge(card.price, playerWallet, playerCards);
    if (insufficientFunds) {
      alert("Insufficient Funds");
      return;
    }
    // remove coins from player wallet and put coins back into bank
    for (let [color, price] of Object.entries(charge)) {
      playerWallet[color] -= price;
      bank.wallet[color] += price;
    }
    // add card and points to player
    playerCards[card.color].push(card);
    player.addPoints(card.points);
    // replace card on the board
    // TODO don't replace if there remaining deck is 0
    // TODO after buying from reserved, close all modals
    let board = this.state.board.slice();
    let decks = this.state.decks.slice();
    if (source === BOARD) {
      lifecycle = lifecycle.buyFromBoard;
      lifecycle = lifecycle.replenishBoard;
      board[level][column] = 0 < decks[level].length ? decks[level].pop() : null;
    } else if (source === RESERVED) {
      player.reserved.splice(index, 1);
      lifecycle = lifecycle.buyFromReservation;
    }
    this.setState({
      players: players,
      bank: bank,
      board: board,
      decks: decks,
      lifecycle: lifecycle.selectNoble
    })
  }

  handleReserve(source, level, column, card) {
    let lifecycle = this.state.lifecycle;
    console.log("current state: ", lifecycle.description, lifecycle);
    if (lifecycle.reserveFromBoard === undefined && lifecycle.reserveFromDecks === undefined) {
      console.log("Cannot reserve in current lifecycle state: ", lifecycle);
      return;
    }
    let players = this.state.players.slice(0, this.state.numPlayers + 1);
    let player = players[this.state.currentPlayerIdx];
    let reserved = player.reserved;
    let bank = new BankBase();
    Object.assign(bank.wallet, this.state.bank.wallet);
    if (MAX_PLAYER_RESERVATION <= reserved.length) {
      alert("exceeds max allow reservations");
      return;
    }
    if (card === null) {
      return;
    }
    player.reserve(card);
    let decks = this.state.decks.slice();
    let board = this.state.board.slice();
    if (source === DECK) {
      lifecycle = lifecycle.reserveFromDecks;
      decks[level].pop();
    } else {
      lifecycle = lifecycle.reserveFromBoard;
      lifecycle = lifecycle.replenishBoard;
      board[level][column] = 0 < decks[level].length ? decks[level].pop() : null;
    }
    if (0 < bank.wallet[WILD]) {
      lifecycle = lifecycle.collectCoins;
      player.coins[WILD]++;
      bank.wallet[WILD]--;
    }
    lifecycle = MAX_PLAYER_COINS < player.coins.sum() ? lifecycle.returnCoins : lifecycle.selectNoble;
    this.setState({
      players: players,
      bank: bank,
      board: board,
      decks: decks,
      lifecycle: lifecycle
    });
  }

  calculateWinner(playersRanked) {
    return this.state.pointsToWin <= playersRanked[0].points ? playersRanked[0] : null;
  }

  declareWinner(playersRanked) {
    let msg = playersRanked.map((player, idx) => {
      return `\n${idx + 1}. ${player.name} ${player.points}`;
    })
    alert("Winner: \n" + msg);
  }

  displayRank(playersRanked) {
    return playersRanked.map((player, idx) => `\n${idx + 1}. ${player.name} : ${player.points}`);
  }

  listSelectableNoblemen(player, nobles) {
    let selectableNoblemen = nobles.map(noble => {
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
    let lifecycle = this.state.lifecycle;
    console.log("current state: ", lifecycle.description, lifecycle);
    if (lifecycle.description !== 'selectNoble') {
      console.log("Cannot select Noble in current lifecycle state: ", lifecycle);
      return;
    }
    // player adds noblemen
    // after picking up noblemen, replace with stub so the placement is still the same
    const { currentPlayerIdx, numPlayers } = this.state;
    let players = this.state.players.slice();
    let player = players[currentPlayerIdx];
    let nobles = this.state.nobles.slice();
    let noble = nobles[nobleIndex];
    noble.isDisplayed = false;
    player.addNoble(noble);
    player.addPoints(noble.points);
    this.setState({
      players: players,
      nobles: nobles,
      selectableNoblemen: [],
      lifecycle: lifecycle.endOfTurn,
      noblemenSelectionOpen: false,
    });
  }

  handleWinner(players, currentPlayerIdx, numPlayers) {
    if (currentPlayerIdx + 1 === numPlayers) {  // check for winner at end of round
      const playersRanked = rank(players, 'points');
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

  handleEndGame() {
    alert(this.displayRank(rank(this.state.players, 'points')));
    this.setState({ finished: true });
  }

  handleEndRound() {
    const { players, lifecycle } = this.state;
    console.log("current state: ", lifecycle.description, lifecycle);
    if (lifecycle.description !== 'endOfRound') {
      console.log("Cannot end round in current lifecycle state: ", lifecycle);
      return;
    }
    const playersRanked = rank(players, 'points');
    const winner = this.calculateWinner(playersRanked);
    this.setState({
      lifecycle: winner ? lifecycle.endOfGame : lifecycle.startOfTurn
    });
  }

  handleEndTurn() {
    const { currentPlayerIdx, numPlayers, lifecycle } = this.state;
    console.log("current state: ", lifecycle.description, lifecycle);
    if (lifecycle.description !== 'endOfTurn') {
      console.log("Cannot end turn in current lifecycle state: ", lifecycle);
      return;
    }
    let nextLifecycle = lifecycle;
    if (currentPlayerIdx + 1 === numPlayers) {
      nextLifecycle = lifecycle.endOfRound;
    } else {
      nextLifecycle = lifecycle.startOfTurn;
    }
    this.setState({
      selectableNoblemen: [],
      currentPlayerIdx: (currentPlayerIdx + 1) % numPlayers,
      lifecycle: nextLifecycle
    });
  }

  render() {
    const { board, decks, nobles, noblemenSelectionOpen, selectableNoblemen, currentPlayerIdx, numPlayers, finished } = this.state;
    const players = this.state.players.map((player) => {
      return (
        <>
          <Player
            {...player}
            player={player}
            activePlayer={player.position === currentPlayerIdx}
            finished={finished}
            handleBuy={this.handleBuy}
          />
          <Divider />
        </>
      );
    });
    let status;
    if (finished) {  // check for winner at end of round
      const playersRanked = rank(this.state.players, 'points');
      status = "Game Over:\n" + this.displayRank(playersRanked);
    } else {
      status = "Next player: " + this.state.players[currentPlayerIdx].name;
    }

    return (
      <Container className={'large'} style={{ marginTop: '3em' }}>
        <Grid>
          <Grid.Column width={4}>
            {players}
          </Grid.Column>
          <Grid.Column width={2}>
            <Bank
              coins={this.state.bank.wallet}
              handleCoinTransaction={this.handleCoinTransaction}
              finished={finished}
            />
            <ReturnCoinsModal
              coins={this.state.players[currentPlayerIdx].coins}
              open={this.state.returnCoinsModalOpen}
              handleCoinTransaction={this.handleCoinTransaction}
            />
          </Grid.Column>
          <Grid.Column width={7}>
            <Grid.Row>
              <Noblemen
                noblemen={nobles}
                includesList={nobles.map(noble => noble.isDisplayed)}
              />
              <ModalNoblemen
                noblemen={nobles}
                includesList={selectableNoblemen}
                onClick={this.handleNoblemenSelection}
                open={noblemenSelectionOpen}
              />
            </Grid.Row>
            <Grid.Row>
              <Board
                cards={board}
                decks={decks}
                playerWallet={this.state.players[currentPlayerIdx].coins}
                playerCards={this.state.players[currentPlayerIdx].cards}
                handleBuy={this.handleBuy}
                handleReserve={this.handleReserve}
                finished={finished}
              />
            </Grid.Row>
          </Grid.Column>
          <Grid.Column width={3}>
            <History status={status} />
          </Grid.Column>
        </Grid>
      </Container>
    );
  }
}

export default Game;