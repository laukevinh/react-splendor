export default function Wallet(isBank, numPlayers) {
  const maxCoins = {
    2:4,  // in 2 player game, bank carries max 4 coins per color
    3:5,
    4:7,
  };
  const startingBalance = isBank ? maxCoins[numPlayers] : 0;
  const numWilds = isBank ? 5 : 0;
  
  return {
    'white': startingBalance,
    'blue': startingBalance,
    'green': startingBalance,
    'red': startingBalance,
    'black': startingBalance,
    'wild': numWilds,
  };
}