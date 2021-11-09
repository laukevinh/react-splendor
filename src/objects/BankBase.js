import { MAX_BANK_COINS, MIN_PLAYERS } from "../constants/defaults";
import Wallet from "./Wallet";

class BankBase {
  constructor(numPlayers = MIN_PLAYERS) {
    this.wallet = new Wallet(MAX_BANK_COINS[numPlayers]);
  }
}

export default BankBase;