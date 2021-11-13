import Wallet from './objects/Wallet';
import Coin from './components/Coin';

export const DECK = 'deck';
export const BOARD = 'board';
export const RESERVED = 'reserved';
export const WHITE = 'white';
export const BLUE = 'blue';
export const GREEN = 'green';
export const RED = 'red';
export const BLACK = 'black';
export const WILD = 'wild';

export default function renderPrice(price, type) {
  return Object.entries(price).map(([color, amt]) => {
    if (amt === 0) {
      return <></>;
    }
    if (type === 'coin') {
      return <Coin color={color}>{amt}</Coin>;
    }
    if (type === 'game-card') {
      return <GameCard color={color}>{amt}</GameCard>;
    }
  });
}

export function GameCard(props) {
  let displayClass;
  if (props.selectable === true) {
    displayClass = "selectable";
  } else {
    displayClass = "";
  }
  const classNames = ["game-card", props.size || "mini", props.color, displayClass].join(" ");
  return (
    <div
      className={classNames}
    >
      {props.children}
    </div>
  );
}

export function calculateCharge(price, playerWallet, playerCards) {
  let charge = new Wallet();
  let response = {
    insufficientFunds: null,
    charge: charge,
  }
  for (let [color, colorPrice] of Object.entries(price)) {
    let remainder = colorPrice - playerCards[color].length;
    if (playerWallet[color] + playerWallet[WILD] < remainder) {
      response.insufficientFunds = true;
      return response;
    } else if (playerWallet[color] < remainder) {
      charge[color] = playerWallet[color];
      charge[WILD] += remainder - playerWallet[color];
    } else {
      charge[color] = remainder;
    }
    if (playerWallet[WILD] - charge[WILD] < 0) {
      response.insufficientFunds = true;
      return response;
    }
  }
  response.insufficientFunds = false;
  return response;
}

function randInt(i, j) {
  return Math.floor(Math.random() * (j - i) + i);
}

function swap(A, i, j) {
  let temp = A[i];
  A[i] = A[j];
  A[j] = temp;
}

export function shuffle(A) {
  let n = A.length;
  for (let k = 0; k < n; k++) {
    swap(A, k, randInt(0, n - 1));
  }
  return A;
}

export function any(array) {
  for (let each of array) {
    if (each === true) {
      return true;
    }
  }
  return false;
}

export function rank(array, attribute) {
  return array.slice().sort((a, b) => b[attribute] - a[attribute]);
}