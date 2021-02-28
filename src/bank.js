import React from 'react';
import ReactDOM from 'react-dom';
import { Button } from 'semantic-ui-react'

export default class Bank extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      coins: {
        'white': props.maxCoins,
        'blue': props.maxCoins,
        'green': props.maxCoins,
        'red': props.maxCoins,
        'black': props.maxCoins,
        'wild': 5,
      },
    };
  }

  handleClick = (color, count) => {
    this.state.coins[color]--;
    this.setState((state) => {
      return {coins: this.state.coins}
    });
  }
  
  render() {
    const coins = Object.entries(this.state.coins).map(([color, count], idx) => {
      return (
        <li key={idx}>
          <Button
            content={color}
            color={color}
            label={count}
            labelPosition='right'
            onClick={() => this.handleClick(color, count)}
          />
        </li>
      );
    });
    return (coins);
  }
}