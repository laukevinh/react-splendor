import { CardWallet, CoinWallet } from "./Wallet";

export default class PlayerBase {
  constructor(name, position) {
    this.coins = new CoinWallet();
    this.cards = new CardWallet();
    this.reserved = [];
    this.points = 0;
    this.noblemen = [];
    this.name = name;
    this.position = position;
  }

  reserve(card) {
    this.reserved.push(card);
  }

  addNoble(noble) {
    this.noblemen.push(noble);
  }

  addPoints(points) {
    this.points += points;
  }
}