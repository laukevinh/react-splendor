import Wallet from "./Wallet";

class PurchasedCards {
  constructor() {
    this.white = [];
    this.blue = [];
    this.green = [];
    this.red = [];
    this.black = [];
  }
}

export default class PlayerBase {
  constructor(name, position) {
    this.coins = new Wallet();
    this.cards = new PurchasedCards();
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