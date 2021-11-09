import Board from '../components/Board';
import Bank from '../components/Bank';
import Noblemen, { ModalNoblemen } from '../components/Noblemen';
import Player, { PlayerBase } from '../components/Player';
import { Grid, Container, Divider } from 'semantic-ui-react';
import ReturnCoinsModal from '../components/ReturnCoinsModal';
import { calculateCharge, shuffle, WILD, DECK, BOARD, RESERVED, any, rank } from '../utils';
import React from 'react';
import cardData from "../constants/cardData.json";
import nobleData from "../constants/nobleData.json";
import Mine from '../objects/Mine';
import History from '../components/History';
import DesktopLayout from '../layouts/desktop';
import { MAX_BOARD_COLS, MAX_BOARD_ROWS, MAX_PLAYER_COINS, MAX_PLAYER_RESERVATION } from '../constants/defaults';
import { NobleBase } from '../objects/NobleBase';
import BankBase from '../objects/BankBase';

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.handleCoinTransaction = this.handleCoinTransaction.bind(this);
    this.handleBuy = this.handleBuy.bind(this);
    this.handleReserve = this.handleReserve.bind(this);
    this.handleNoblemenSelection = this.handleNoblemenSelection.bind(this);
    let shuffledDecks = this.createDecks();
    let board = this.createBoard(shuffledDecks);

    this.state = {
      numPlayers: props.numPlayers,
      pointsToWin: props.pointsToWin,
      players: this.createPlayerBases(props.numPlayers),
      currentPlayerIdx: 0,
      bank: new BankBase(props.numPlayers),
      decks: shuffledDecks,
      board: board,
      nobles: this.createNobles(props.numPlayers),
      finished: false,
      returnCoinsModalOpen: false,
      noblemenSelectionOpen: false,
      selectableNoblemen: [],
      isNewGame: props.isNewGame
    };
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.isNewGame === true) {
      let shuffledDecks = this.createDecks();
      let board = this.createBoard(shuffledDecks);

      this.setState((state, props) => {
        props.setIsNewGame(false);
        return {
          players: this.createPlayerBases(props.numPlayers),
          currentPlayerIdx: 0,
          bank: new BankBase(props.numPlayers),
          returnCoinsModalOpen: false,
          board: board,
          decks: this.createDecks(),
          nobles: this.createNobles(props.numPlayers),
          noblemenSelectionOpen: false,
          selectableNoblemen: [],
          numPlayers: props.numPlayers,
          pointsToWin: props.pointsToWin,
          finished: false,
          isNewGame: false
        };
      });
    }
  }

  createCards(cardDataList) {
    return cardDataList.map((
      [color, points, white, blue, green, red, black]
    ) => {
      return new Mine(color, points, white, blue, green, red, black);
    });
  }

  createDecks() {
    const levels = ["0", "1", "2"];
    return levels.map(level => {
      return shuffle(this.createCards(cardData[level]));
    })
  }

  createBoard(decks) {
    return Array(MAX_BOARD_ROWS).fill(undefined).map((e, idx) => {
      return Array(MAX_BOARD_COLS).fill(undefined).map(() => {
        const level = idx;
        return decks[level].pop();
      })
    });
  }

  createPlayerBases(numPlayers) {
    return Array(numPlayers).fill(undefined).map((e, idx) => {
      return new PlayerBase(`Player ${idx}`, idx);
    });
  }

  createNobles(numPlayers) {
    let nobles = nobleData.map(([points, white, blue, green, red, black]) => {
      return new NobleBase(points, white, blue, green, red, black, true)
    });
    return shuffle(nobles).slice(0, numPlayers + 1);
  }

  handleCoinTransaction(transactionAmountWallet, isPlayerCollecting) {
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
      // trigger modal
      this.setState({
        players: players,
        bank: bank,
        returnCoinsModalOpen: true
      });
    } else {
      this.setState({
        players: players,
        bank: bank,
        returnCoinsModalOpen: false
      });
      this.handleEndTurn();
    }
  }

  handleBuy(source, level, column, index, card) {
    // todo upgrade: add sidebar where you can choose which coins to spend
    // todo BUG when you have consecutive handlebuy actions, sometimes the bankcoins go negative
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
      board[level][column] = 0 < decks[level].length ? decks[level].pop() : null;
    } else if (source === RESERVED) {
      player.reserved.splice(index, 1);
    }
    this.setState({
      players: players,
      bank: bank,
      board: board,
      decks: decks,
    })
    this.handleEndTurn();
  }

  handleReserve(source, level, column, card) {
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
    if (0 < bank.wallet[WILD]) {
      player.coins[WILD]++;
      bank.wallet[WILD]--;
    }
    // replace card on the board
    // TODO if source is top of deck don't replace
    let decks = this.state.decks.slice();
    let board = this.state.board.slice();
    if (source === DECK) {
      decks[level].pop();
    } else {
      board[level][column] = decks[level].pop();
    }
    this.setState({
      players: players,
      bank: bank,
      board: board,
      decks: decks,
    });
    if (10 < player.coins.sum()) {
      // trigger modal
      this.setState({ returnCoinsModalOpen: true });
    } else {
      this.handleEndTurn();
    }
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
      noblemenSelectionOpen: false,
    });
    this.handleWinner(players, currentPlayerIdx, numPlayers);
    this.handleNextTurn(currentPlayerIdx, numPlayers);
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

  handleEndTurn() {
    // qualify for nobleman?
    // toggle modal open -> let modal handle real end turn
    // no -> real end turn
    const { players, nobles, currentPlayerIdx, numPlayers } = this.state;
    const player = players[currentPlayerIdx];
    // TODO: BUG: if you qualify for 1 nobleman, you don't need to invest further to get the second... 
    // might only be a problem now because noblement aren't unique.
    const selectableNoblemen = this.listSelectableNoblemen(player, nobles);
    if (any(selectableNoblemen)) {
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
    const { board, decks, nobles, noblemenSelectionOpen, selectableNoblemen, currentPlayerIdx, numPlayers, finished } = this.state;
    const players = Object.values(this.state.players).map((player) => {
      return (
        <>
          <Player
            {...player}
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
              <Noblemen noblemen={nobles} />
              <ModalNoblemen
                noblemen={nobles}
                selectableNoblemen={selectableNoblemen}
                handleNoblemenSelection={this.handleNoblemenSelection}
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