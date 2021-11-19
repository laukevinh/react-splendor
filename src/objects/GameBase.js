import { NobleBase } from "./NobleBase";
import { MAX_BANK_COINS, MAX_BOARD_COLS, MAX_BOARD_ROWS } from "../constants/defaults";
import { shuffle } from "../utils";
import Mine from "./Mine";
import cardData from "../constants/cardData.json";
import nobleData from "../constants/nobleData.json";
import BankBase from "./BankBase";
import PlayerBase from "./PlayerBase";
import StateMachine from "./StateMachine";

export default class GameBase {
  constructor(numPlayers, pointsToWin) {
    this.numPlayers = numPlayers;
    this.pointsToWin = pointsToWin;
    this.players = this.createPlayerBases();
    this.currentPlayerIdx = 0;
    this.bank = new BankBase(numPlayers);
    this.decks = this.createDecks();
    this.board = this.createBoard();
    this.nobles = this.createNobles();
    this.status = 'Not started';
    this.stateMachine = new StateMachine();
  }

  createPlayerBases() {
    return Array(this.numPlayers).fill(undefined).map((e, idx) => {
      return new PlayerBase(`Player ${idx}`, idx)
    });
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

  createBoard() {
    return Array(MAX_BOARD_ROWS).fill(undefined).map((e, idx) => {
      return Array(MAX_BOARD_COLS).fill(undefined).map(() => {
        const level = idx;
        return this.decks[level].pop();
      })
    });
  }

  createNobles() {
    let nobles = nobleData.map(([points, white, blue, green, red, black]) => {
      return new NobleBase(points, white, blue, green, red, black, true)
    });
    return shuffle(nobles).slice(0, this.numPlayers + 1);
  }
}