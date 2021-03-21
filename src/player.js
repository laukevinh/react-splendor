import React from 'react';
import { Button, Grid, Card } from 'semantic-ui-react'

export default class Player extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const coins = Object.entries(this.props.coins).map(([color, count], idx) => {
      return (
        <Grid.Column>
          <div className={"coin " + color}>
            {count}
          </div>
        </Grid.Column>
      );
    });
    const cards = Object.entries(this.props.cards).map(([color, cardArray]) => {
      return (
        <Grid.Column>
          <Card className="mini">
            <Card.Content className={color}>
              {cardArray.length}
            </Card.Content>
          </Card>
        </Grid.Column>
      );
    })
    return (
      <Grid className={this.props.activePlayer ? "active-player" : null}>
        <Grid.Row columns={2}>
          <Grid.Column>{this.props.points}</Grid.Column>
          <Grid.Column textAlign="right">{this.props.playerName}</Grid.Column>
        </Grid.Row>
        <Grid.Row columns={6}>
          {coins}
        </Grid.Row>
        <Grid.Row columns={6}>
          {cards}
        </Grid.Row>
      </Grid>
    );
  }
}