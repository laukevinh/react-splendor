export default class StateMachine {
  constructor() {
    this.endOfGame = {
      description: 'endOfGame'
    };
    this.endOfRound = {
      startOfRound: undefined,
      endOfGame: this.endOfGame
    }
    this.endOfTurn = {
      description: 'endOfTurn',
      startOfTurn: undefined
    }
    this.selectNoble = {
      description: 'selectNoble',
      endOfTurn: this.endOfTurn
    }
    this.returnCoins = {
      description: 'returnCoins',
      selectNoble: this.selectNoble,
      endOfTurn: this.endOfTurn
    }
    this.replenishBoard = {
      description: 'replenishBoard',
      returnCoins: this.returnCoins,
      collectCoins: undefined,
      selectNoble: this.selectNoble
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
    this.collectCoins = {
      description: 'collectCoins',
      returnCoins: this.returnCoins,
      selectNoble: this.selectNoble,
      endOfTurn: this.endOfTurn
    }
    this.reserveFromDecks = {
      description: 'reserveFromDecks',
      collectCoins: this.collectCoins,
      selectNoble: this.selectNoble
    }
    this.startOfTurn = {
      description: 'startOfTurn',
      buyFromBoard: this.buyFromBoard,
      buyFromReservation: this.buyFromReservation,
      reserveFromBoard: this.reserveFromBoard,
      reserveFromDecks: this.reserveFromDecks,
      collectCoins: this.collectCoins,
    };
    this.startOfRound = {
      description: 'startOfRound',
      startOfTurn: this.startOfTurn
    }
    this.startOfGame = {
      description: 'startOfGame',
      startOfRound: this.startOfRound
    }
    this.replenishBoard.collectCoins = this.collectCoins;
    this.endOfRound.startOfRound = this.startOfRound;
    this.endOfTurn.startOfTurn = this.startOfTurn;
    // this.selector = {
    //   'startOfGame': this.startOfGame,
    //   'startOfRound': this.startOfRound,
    //   'startOfTurn': this.startOfTurn,
    //   'buyFromBoard': this.buyFromBoard,
    //   'buyFromReservation': this.buyFromReservation,
    //   'reserveFromBoard': this.reserveFromBoard,
    //   'reserveFromDecks': this.reserveFromDecks,
    //   'collectCoins': this.collectCoins,
    //   'replenishBoard': this.replenishBoard,
    //   'returnCoins': this.returnCoins,
    //   'selectNoble': this.selectNoble,
    //   'endOfTurn': this.endOfTurn,
    //   'endOfRound': this.endOfRound,
    //   'endOfGame': this.endOfGame
    // }
    // this.state = this.selector[startingState] || this.startOfGame;
  }
}