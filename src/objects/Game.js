import { PlayerBase } from "../components/Player";
import { MAX_BANK_COINS, MAX_BOARD_COLS, MAX_BOARD_ROWS } from "../constants/defaults";
import { shuffle } from "../utils";
import Wallet from "./Wallet";
import cardData from "../constants/cardData.json";
import Mine from "./Mine";

class Game {
  constructor(numPlayers, pointsToWin) {
    this.numPlayers = numPlayers;
    this.pointsToWin = pointsToWin;
    this.players = this.createPlayerBases();
    this.currentPlayerIdx = 0;
    this.bank = new Wallet(MAX_BANK_COINS[numPlayers]);
    this.decks = this.createDecks();
    this.board = this.createBoard();
    this.nobles;
    this.status;
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

  createBoard(decks) {
    return Array(MAX_BOARD_ROWS).fill(undefined).map((e, idx) => {
      return Array(MAX_BOARD_COLS).fill(undefined).map(() => {
        const level = idx;
        return decks[level].pop();
      })
    });
  }

}