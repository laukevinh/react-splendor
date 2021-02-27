import React from 'react';
import ReactDOM from 'react-dom';
import { Button } from 'semantic-ui-react'



export default class Bank extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      coins: [
        {
          count: 4,
          color: 'white',
        },
        {
          count: 4,
          color: 'blue',
        },
        {
          count: 4,
          color: 'green',
        },
        {
          count: 4,
          color: 'red',
        },
        {
          count: 4,
          color: 'black',
        },
        {
          count: 4,
          color: 'wild',
        },
      ]
    };
  }

  
  render() {
    const coins = this.state.coins.map((coin) => { //move is the index
      return (
        <Button
          content={coin.color}
          color={coin.color}
          label={coin.count}
          labelPosition='right'
        />
      );
    });
    return (coins);
  }
}