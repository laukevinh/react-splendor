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

  render() {
    const coins = Object.entries(this.props.coins).map(([color, count], idx) => {
      return <Button color={color} content={count} />;
    });
    return (
      <Grid columns={2} padded='vertically'>
        <Grid.Column>{this.props.points}</Grid.Column>
        <Grid.Column>{this.props.playerName}</Grid.Column>
        <Button.Group>
          {coins}
        </Button.Group>
        <Grid.Row>
          {this.props.cards}
        </Grid.Row>
      </Grid>
    );
  }
}