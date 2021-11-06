import { WHITE, BLUE, GREEN, RED, BLACK, WILD } from "../constants/colors";
import whiteCoin from '../assets/white-coin.png';
import blueCoin from '../assets/blue-coin.png';
import greenCoin from '../assets/green-coin.png';
import redCoin from '../assets/red-coin.png';
import blackCoin from '../assets/black-coin.png';
import wildCoin from '../assets/wild-coin.png';
import { Image } from "semantic-ui-react";

function Coin(props) {
  let displayClass;
  if (props.onClick && !props.disabled) {
    displayClass = "selectable";
  } else if (props.onClick && props.disabled) {
    displayClass = "disabled";
  } else {
    displayClass = "";
  }
  const classNames = ["circle", props.color, displayClass].join(" ");
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
    <div className={'coinContainer'}>
      <div
        className={classNames}
        onClick={() => { props.onClick && !props.disabled ? props.onClick(props.color) : void (0) }}
      >
        {props.children}
      </div>
      <img className={'icon'} src={imgSrc} width={16} height={16} />
    </div>
  );
}

export default Coin;