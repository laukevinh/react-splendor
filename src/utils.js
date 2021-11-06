import React from 'react';
import 'semantic-ui-css/semantic.min.css';
import { Image } from 'semantic-ui-react';
import Wallet from './components/Wallet';
import whiteCoin from './assets/white-coin.png';
import blueCoin from './assets/blue-coin.png';
import greenCoin from './assets/green-coin.png';
import redCoin from './assets/red-coin.png';
import blackCoin from './assets/black-coin.png';
import wildCoin from './assets/wild-coin.png';

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
  let prices = [];
  for (let [color, colorPrice] of Object.entries(price)) {
    if (0 < colorPrice) {
      let elem;
      if (type === 'coin') {
        elem = <Coin color={color} content={colorPrice} />;
      } else if (type === 'game-card') {
        elem = <GameCard color={color} content={colorPrice} />;
      }
      prices.push(elem);
    }
  }
  return (prices);
}

export function Coin(props) {
  let displayClass;
  if (props.onClick && !props.disabled) {
    displayClass = "selectable";
  } else if (props.onClick && props.disabled) {
    displayClass = "disabled";
  } else {
    displayClass = "";
  }
  const classNames = ["coinContainer", displayClass].join(" ");
  let imgSrc;
  if (props.color === WHITE) {
    imgSrc = whiteCoin;
  } else if (props.color === BLUE) {
    imgSrc = blueCoin;
  } else if (props.color === GREEN) {
    imgSrc = greenCoin;
  } else if (props.color === RED) {
    imgSrc = redCoin;
  } else if (props.color === BLACK) {
    imgSrc = blackCoin;
  } else if (props.color === WILD) {
    imgSrc = wildCoin;
  } else {
    imgSrc = null;
  }
  return (
    <div
      className={classNames}
      onClick={() => { props.onClick && !props.disabled ? props.onClick(props.color) : void (0) }}
    >
      <Image src={imgSrc} size='mini' />
      <div className='coinContent'>{props.content}</div>
    </div>
  );
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
      {props.content}
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