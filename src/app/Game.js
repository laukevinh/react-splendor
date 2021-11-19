import Board from '../components/Board';
import Bank from '../components/Bank';
import Noblemen, { ModalNoblemen } from '../components/Noblemen';
import Player from '../components/Player';
import { Grid, Container, Divider } from 'semantic-ui-react';
import ReturnCoinsModal from '../components/ReturnCoinsModal';
import { calculateCharge, WILD, any, rank, isAbleToBuy } from '../utils';
import React from 'react';
import History from '../components/History';
import DesktopLayout from '../layouts/desktop';
import { MAX_PLAYER_COINS, MAX_PLAYER_RESERVATION } from '../constants/defaults';
import BankBase from '../objects/BankBase';
import PlayerBase from '../objects/PlayerBase';

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.handleCoinTransaction = this.handleCoinTransaction.bind(this);
    this.handleBuyFromBoard = this.handleBuyFromBoard.bind(this);
    this.handleBuyFromReservation = this.handleBuyFromReservation.bind(this);
    this.handleReserveFromDeck = this.handleReserveFromDeck.bind(this);
    this.handleReserveFromBoard = this.handleReserveFromBoard.bind(this);
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
    const {
      players,
      currentPlayerIdx,
      bank,
      lifecycle
    } = this.state;

    console.log("current state: ", lifecycle.description, lifecycle);
    if (lifecycle.collectCoins === undefined && lifecycle.returnCoins === undefined && lifecycle.description !== 'returnCoins') {
      console.log("Cannot collect or return coins in current lifecycle state: ", lifecycle);
      return;
    }

    const currentPlayer = players[currentPlayerIdx];
    let newLifecycle = isPlayerCollecting ? lifecycle.collectCoins : lifecycle;
    let newPlayers = players.slice();
    let newPlayer = Object.assign(new PlayerBase(), currentPlayer);
    let newBank = Object.assign(new BankBase(), bank);
    for (let color of Object.keys(transactionAmountWallet)) {
      if (isPlayerCollecting) {
        newBank.wallet[color] -= transactionAmountWallet[color];
        newPlayer.coins[color] += transactionAmountWallet[color];
      } else {
        newBank.wallet[color] += transactionAmountWallet[color];
        newPlayer.coins[color] -= transactionAmountWallet[color];
      }
    }

    newPlayers[currentPlayerIdx] = newPlayer;
    if (MAX_PLAYER_COINS < newPlayer.coins.sum()) {
      this.setState({
        players: newPlayers,
        bank: newBank,
        lifecycle: newLifecycle.returnCoins,
      });
    } else {
      this.setState({
        players: newPlayers,
        bank: newBank,
        lifecycle: newLifecycle.selectNoble,
        returnCoinsModalOpen: false
      });
    }
  }

  handleBuyFromBoard(level, column) {
    // todo upgrade: add sidebar where you can choose which coins to spend
    // todo BUG when you have consecutive handlebuy actions, sometimes the bankcoins go negative
    const {
      players,
      currentPlayerIdx,
      bank,
      board,
      decks,
      lifecycle
    } = this.state;

    console.log("current state: ", lifecycle.description, lifecycle);
    if (lifecycle.buyFromBoard === undefined) {
      console.log("Cannot buy from board in current lifecycle state: ", lifecycle);
    }

    const currentPlayer = players[currentPlayerIdx];
    const card = board[level][column];
    const chargeAmtWallet = calculateCharge(card, currentPlayer);

    if (!isAbleToBuy(card, currentPlayer)) {
      alert("Insufficient Funds");
      return;
    }

    let newLifecycle = lifecycle.buyFromBoard;
    let newPlayers = players.slice();
    let newPlayer = Object.assign(new PlayerBase(), currentPlayer);
    let newBank = Object.assign(new BankBase(), bank);

    for (let [color, price] of Object.entries(chargeAmtWallet)) {
      newPlayer.coins[color] -= price;
      newBank.wallet[color] += price;
    }

    newPlayer.cards[card.color].push(card);
    newPlayer.addPoints(card.points);

    let newDecks = decks.slice();
    let newBoard = board.slice();
    newLifecycle = newLifecycle.replenishBoard;
    newBoard[level][column] = 0 < decks[level].length ? newDecks[level].pop() : null;

    newPlayers[currentPlayerIdx] = newPlayer;

    this.setState({
      players: newPlayers,
      bank: newBank,
      decks: newDecks,
      board: newBoard,
      lifecycle: newLifecycle.selectNoble
    });
  }

  handleBuyFromReservation(index) {
    // todo upgrade: add sidebar where you can choose which coins to spend
    // todo BUG when you have consecutive handlebuy actions, sometimes the bankcoins go negative
    const {
      players,
      currentPlayerIdx,
      bank,
      lifecycle
    } = this.state;

    console.log("current state: ", lifecycle.description, lifecycle);
    if (lifecycle.buyFromReservation === undefined) {
      console.log("Cannot buy from reservation in current lifecycle state: ", lifecycle);
    }

    const currentPlayer = players[currentPlayerIdx];
    const card = currentPlayer.reserved[index];
    const chargeAmtWallet = calculateCharge(card, currentPlayer);

    if (!isAbleToBuy(card, currentPlayer)) {
      alert("Insufficient Funds");
      return;
    }

    let newLifecycle = lifecycle.buyFromReservation;
    let newPlayers = players.slice();
    let newPlayer = Object.assign(new PlayerBase(), currentPlayer);
    let newBank = Object.assign(new BankBase(), bank);
    // TODO after buying from reserved, close all modals
    for (let [color, price] of Object.entries(chargeAmtWallet)) {
      newPlayer.coins[color] -= price;
      newBank.wallet[color] += price;
    }

    newPlayer.cards[card.color].push(card);
    newPlayer.addPoints(card.points);

    newPlayer.reserved.splice(index, 1);

    newPlayers[currentPlayerIdx] = newPlayer;

    this.setState({
      players: newPlayers,
      bank: newBank,
      lifecycle: newLifecycle.selectNoble
    });
  }

  handleReserveFromDeck(level) {
    const {
      players,
      currentPlayerIdx,
      bank,
      decks,
      lifecycle
    } = this.state;

    console.log("current state: ", lifecycle.description, lifecycle);
    if (lifecycle.reserveFromDecks === undefined) {
      console.log("Cannot reserve from deck in current lifecycle state: ", lifecycle);
    }

    const currentPlayer = players[currentPlayerIdx];
    if (MAX_PLAYER_RESERVATION <= currentPlayer.reserved.length) {
      alert("exceeds max allow reservations");
      return;
    }
    if (decks[level].length === 0) {
      alert("empty deck size: ", decks[level].length);
      return;
    }

    let newLifecycle = lifecycle.reserveFromDecks;
    let newPlayers = players.slice();
    let newPlayer = Object.assign(new PlayerBase(), currentPlayer);
    let newDecks = decks.slice();
    newPlayer.reserve(newDecks[level].pop());

    let newBank = Object.assign(new BankBase(), bank);
    if (0 < bank.wallet[WILD]) {
      newLifecycle = newLifecycle.collectCoins;
      newPlayer.coins[WILD]++;
      newBank.wallet[WILD]--;
    }

    newPlayers[currentPlayerIdx] = newPlayer;
    newLifecycle = MAX_PLAYER_COINS < newPlayer.coins.sum() ? newLifecycle.returnCoins : newLifecycle.selectNoble;

    this.setState({
      players: newPlayers,
      bank: newBank,
      decks: newDecks,
      lifecycle: newLifecycle
    });
  }

  handleReserveFromBoard(level, column) {
    const {
      players,
      currentPlayerIdx,
      board,
      bank,
      decks,
      lifecycle
    } = this.state;

    console.log("current state: ", lifecycle.description, lifecycle);
    if (lifecycle.reserveFromBoard === undefined) {
      console.log("Cannot reserve from board in current lifecycle state: ", lifecycle);
    }

    const currentPlayer = players[currentPlayerIdx];
    if (MAX_PLAYER_RESERVATION <= currentPlayer.reserved.length) {
      alert("exceeds max allow reservations");
      return;
    }

    let newLifecycle = lifecycle.reserveFromBoard;
    let newPlayers = players.slice();
    let newPlayer = Object.assign(new PlayerBase(), currentPlayer);
    let newDecks = decks.slice();
    let newBoard = board.slice();
    const card = board[level][column];
    newPlayer.reserve(card);

    newLifecycle = newLifecycle.replenishBoard;
    newBoard[level][column] = 0 < decks[level].length ? newDecks[level].pop() : null;

    let newBank = Object.assign(new BankBase(), bank);
    if (0 < bank.wallet[WILD]) {
      newLifecycle = newLifecycle.collectCoins;
      newPlayer.coins[WILD]++;
      newBank.wallet[WILD]--;
    }

    newPlayers[currentPlayerIdx] = newPlayer;
    newLifecycle = MAX_PLAYER_COINS < newPlayer.coins.sum() ? newLifecycle.returnCoins : newLifecycle.selectNoble;

    this.setState({
      players: newPlayers,
      bank: newBank,
      decks: newDecks,
      board: newBoard,
      lifecycle: newLifecycle
    });
  }

  listSelectableNoblemen(player, nobles) {
    return nobles.map(noble => {
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
  }

  handleNoblemenSelection(nobleIndex) {
    const {
      lifecycle,
      currentPlayerIdx,
      players,
      nobles,
    } = this.state;
    console.log("current state: ", lifecycle.description, lifecycle);
    if (lifecycle.description !== 'selectNoble') {
      console.log("Cannot select Noble in current lifecycle state: ", lifecycle);
      return;
    }
    let newPlayers = players.slice();
    let newPlayer = players[currentPlayerIdx];
    let newNobles = nobles.slice();
    let newNoble = nobles[nobleIndex];
    newNoble.isDisplayed = false;
    newPlayer.addNoble(newNoble);
    newPlayer.addPoints(newNoble.points);
    this.setState({
      players: newPlayers,
      nobles: newNobles,
      selectableNoblemen: [],
      lifecycle: lifecycle.endOfTurn,
      noblemenSelectionOpen: false,
    });
  }

  handleNextTurn(currentPlayerIdx, numPlayers) {
    if (!this.state.finished) { // next player if game not finished
      this.setState({ currentPlayerIdx: (currentPlayerIdx + 1) % numPlayers });
    }
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

  handleEndRound() {
    const {
      players,
      lifecycle,
      pointsToWin
    } = this.state;
    console.log("current state: ", lifecycle.description, lifecycle);
    if (lifecycle.description !== 'endOfRound') {
      console.log("Cannot end round in current lifecycle state: ", lifecycle);
      return;
    }
    const playerListRanked = rank(players, 'points');
    const isWinner = playerListRanked[0].points >= pointsToWin;
    this.setState({
      lifecycle: isWinner ? lifecycle.endOfGame : lifecycle.startOfTurn
    });
  }

  handleEndGame() {
    const playerListRanked = rank(this.state.players, 'points');
    alert(playerListRanked.map((player, idx) => `${idx}: ${player.name}`).join("\n"));
    this.setState({ finished: true });
  }

  render() {
    const {
      board,
      decks,
      players,
      nobles,
      noblemenSelectionOpen,
      selectableNoblemen,
      currentPlayerIdx,
      returnCoinsModalOpen,
      bank,
      finished
    } = this.state;

    return (
      <div className={'background'}>
        <Container className={'large'}>
          <Grid stackable>
            <Grid.Column width={4}>
              {
                players.map(player => {
                  return (
                    <Grid.Row key={player.name}>
                      <Player
                        player={player}
                        currentPlayerIdx={currentPlayerIdx}
                        finished={finished}
                        handleBuyClick={this.handleBuyFromReservation}
                      />
                      <Divider />
                    </Grid.Row>
                  );
                })
              }
            </Grid.Column>
            <Grid.Column width={2}>
              <Bank
                bank={bank}
                coins={this.state.bank.wallet}
                handleCoinTransaction={this.handleCoinTransaction}
                disabled={finished}
              />
              <ReturnCoinsModal
                coins={players[currentPlayerIdx].coins}
                open={returnCoinsModalOpen}
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
                  board={board}
                  decks={decks}
                  players={players}
                  currentPlayerIdx={currentPlayerIdx}
                  handleBuyFromBoard={this.handleBuyFromBoard}
                  handleReserveFromDeck={this.handleReserveFromDeck}
                  handleReserveFromBoard={this.handleReserveFromBoard}
                  finished={finished}
                />
              </Grid.Row>
            </Grid.Column>
            <Grid.Column width={3}>
              <History status={''} />
            </Grid.Column>
          </Grid>
        </Container>
      </div>
    );
  }
}

export default Game;