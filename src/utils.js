import React, { isValidElement } from 'react';
import 'semantic-ui-css/semantic.min.css';
import { Grid } from 'semantic-ui-react';

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
      prices.push(<Grid.Row>{elem}</Grid.Row>);
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
  const classNames = ["coin", props.color, displayClass].join(" ");
  return (
    <div
      className={classNames}
      onClick={() => {props.onClick && !props.disabled ? props.onClick(props.color) : void(0)}}
    >
      {props.content}
    </div>
  );
}

export function GameCard(props) {
  let displayClass;
  if (props.selectable) {
    displayClass = "selectable";
  } else {
    displayClass = "";
  }
  let size;
  if (props.size) {
    size = props.size;
  } else {
    size = "mini"
  }
  const classNames = ["game-card", size, props.color, displayClass].join(" ");
  return (
    <div
      className={classNames}
    >
      {props.content}
    </div>
  );
}
// export class GameCard extends React.Component {
//   constructor(props) {
//     super(props);
//   }
//   render() {
//     console.log("GameCard valid component?", isValidElement(this));
//     console.log("div valid component?", isValidElement(<div></div>));
//     const { selectable, color, content } = this.props;
//     let displayClass;
//     if (selectable) {
//       displayClass = "selectable";
//     } else {
//       displayClass = "";
//     }
//     const classNames = ["game-card", "mini", color, displayClass].join(" ");
//     return (
//       <div
//         className={classNames}
//       >
//         {content}
//       </div>
//     );
//   }
// }