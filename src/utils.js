import Coin from './components/Coin';
import { COLORS_NO_WILD } from './constants/colors';
import { CoinWallet } from './objects/Wallet';

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

export function isAbleToBuy(card, player) {
  const price = card.price;
  const cards = player.cards;
  let newWallet = new CoinWallet();

  COLORS_NO_WILD.forEach(color => {
    let remainder = price[color] - cards[color].length;
    if (newWallet[color] + newWallet[WILD] < remainder) {
      return false;
    } else if (remainder - newWallet[color] > 0) {
      newWallet[WILD] -= remainder - newWallet[color];
    }
  })
  return true;
}

export function calculateCharge(card, player) {
  const price = card.price;
  const cards = player.cards;
  const wallet = player.coins;
  let chargeWallet = new CoinWallet();

  COLORS_NO_WILD.forEach(color => {
    let remainder = price[color] - cards[color].length;
    if (remainder > 0) {
      if (wallet[color] >= remainder) {
        chargeWallet[color] = remainder;
      } else {
        chargeWallet[color] = wallet[color];
        chargeWallet[WILD] = remainder - wallet[color];
      }
    }
  })
  return chargeWallet;
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