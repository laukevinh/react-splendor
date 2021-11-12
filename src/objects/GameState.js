export default class GameState {
  constructor(startingState) {
    // this.startOfTurn = undefined;
    // this.buyFromBoard = undefined;
    // this.buyFromReservation = undefined;
    // this.reserveFromBoard = undefined;
    // this.reserveFromDecks = undefined;
    // this.collectCoins = undefined;
    // this.replenishBoard = undefined;
    // this.returnCoins = undefined;
    // this.selectNoble = undefined;
    // this.endOfTurn = undefined;
    // this.stateDescription = undefined;
    this.endOfTurn = {
      description: 'endOfTurn',
      startOfTurn: undefined
    }
    this.selectNoble = {
      description: 'selectNoble',
      endOfTurn: this.endOfTurn
    }
    this.replenishBoard = {
      description: 'replenishBoard',
      selectNoble: this.selectNoble,
    }
    this.returnCoins = {
      description: 'returnCoins',
      selectNoble: this.selectNoble,
      endOfTurn: this.endOfTurn
    }
    this.buyFromBoard = {
      description: 'buyFromBoard',
      replenishBoard: this.replenishBoard,
    };
    this.buyFromReservation = {
      description: 'buyFromReservation',
      selectNoble: this.selectNoble,
    };
    this.reserveFromBoard = {
      description: 'reserveFromBoard',
      replenishBoard: this.replenishBoard
    }
    this.reserveFromDecks = {
      description: 'reserveFromDecks',
      selectNoble: this.selectNoble
    }
    this.collectCoins = {
      description: 'collectCoins',
      returnCoins: this.returnCoins,
      selectNoble: this.selectNoble,
      endOfTurn: this.endOfTurn
    }
    this.startOfTurn = {
      description: 'startOfTurn',
      buyFromBoard: this.buyFromBoard,
      buyFromReservation: this.buyFromReservation,
      reserveFromBoard: this.reserveFromBoard,
      reserveFromDecks: this.reserveFromDecks,
      collectCoins: this.collectCoins,
    };
    this.endOfTurn = {
      description: 'endOfTurn',
      startOfTurn: this.startOfTurn
    }
    this.selector = {
      'startOfTurn': this.startOfTurn,
      'buyFromBoard': this.buyFromBoard,
      'buyFromReservation': this.buyFromReservation,
      'reserveFromBoard': this.reserveFromBoard,
      'reserveFromDecks': this.reserveFromDecks,
      'collectCoins': this.collectCoins,
      'replenishBoard': this.replenishBoard,
      'returnCoins': this.returnCoins,
      'selectNoble': this.selectNoble,
      'endOfTurn': this.endOfTurn
    }
    this.state = this.selector[startingState] || this.startOfTurn;
  }
}