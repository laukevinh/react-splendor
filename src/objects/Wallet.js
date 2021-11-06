/**
 * Summary. Carries coins for buying cards.
 *
 * Description. Used by PlayerBase and BankBase classes. Not used by CardBase.
 * If the startingBalance is set above 0, we assume this is a wallet for the 
 * BankBase and thus set the wilds to 5.
 *
 */
export default class Wallet {
  constructor(startingBalance = 0) {
    this.white = startingBalance;
    this.blue = startingBalance;
    this.green = startingBalance;
    this.red = startingBalance;
    this.black = startingBalance;
    this.wild = 0 < startingBalance ? 5 : 0;  // max 5 wild coins for all games
  }

  sum() {
    return this.white + this.blue + this.green + this.red + this.black + this.wild;
  }
}