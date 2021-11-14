import { MAX_BANK_COINS, MIN_PLAYERS } from "../constants/defaults";
import { CoinWallet } from "./Wallet";

class BankBase {
  constructor(numPlayers = MIN_PLAYERS) {
    this.wallet = new CoinWallet(MAX_BANK_COINS[numPlayers]);
  }
}

export default BankBase;