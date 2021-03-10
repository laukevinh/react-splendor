import React from 'react';
import { Button, Grid} from 'semantic-ui-react'

export default class Player extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      coins: props.coins,
      cards: props.cards,
      reserved: props.reserved,
      points: props.points,
      noblemen: props.noblemen,
      playerName: props.playerName,
    };
  }

  coins() {
    return this.state.coins;
  }

  render() {
    const coins = Object.entries(this.state.coins).map(([color, count], idx) => {
      return (
        <Button color={color}>{count}</Button>
      );
    });
    return (
      <Grid.Column>
        <Grid.Row>
          {this.state.playerName}
        </Grid.Row>
        <Button.Group>
          {coins}
        </Button.Group>
      </Grid.Column>
    );
  }
}