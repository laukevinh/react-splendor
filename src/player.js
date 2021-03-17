import React from 'react';
import { Button, Grid, Card } from 'semantic-ui-react'

export default class Player extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const coins = Object.entries(this.props.coins).map(([color, count], idx) => {
      return <Button color={color} content={count} />;
    });
    const cards = Object.entries(this.props.cards).map(([color, cardArray]) => {
      return (
        <Card className="mini">
          <Card.Content className={color}>
            {cardArray.length}
          </Card.Content>
        </Card>
      );
    })
    return (
      <Grid className={this.props.activePlayer ? "active-player" : null}>
        <Grid.Row columns={2}>
          <Grid.Column>{this.props.points}</Grid.Column>
          <Grid.Column>{this.props.playerName}</Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column>
            <Button.Group>{coins}</Button.Group>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column>
            <Card.Group itemsPerRow={5}>{cards}</Card.Group>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}