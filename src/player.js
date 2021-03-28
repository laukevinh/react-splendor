import React from 'react';
import { Button, Grid, Card, Modal } from 'semantic-ui-react'
import CardModal from './cardModal';

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
    });
    const activePlayer = this.props.activePlayer && !this.props.finished ? "active-player" : null;
    return (
      <Grid className={activePlayer}>
        <Grid.Row columns={2}>
          <Grid.Column>{this.props.points}</Grid.Column>
          <Grid.Column textAlign="right">{this.props.playerName}</Grid.Column>
        </Grid.Row>
        <Grid.Row columns={6}>
          {coins}
        </Grid.Row>
        <Grid.Row columns={6}>
          {cards}
          <Grid.Column>
            <ModalPlayerDetails {...this.props} />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}

class ModalPlayerDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
    };
  }

  setOpen(open) {
    if (!this.props.finished) {
      this.setState({open: open});
    }
  }

  renderPrice(price) {
    let prices = [];
    for (let [color, colorPrice] of Object.entries(price)) {
      if (colorPrice > 0) {
        prices.push(
          <Grid.Row>
            <div className={"coin " + color}>
              {colorPrice}
            </div>
          </Grid.Row>
        );
      }
    }
    return (prices);
  }

  render() {
    const open = this.state.open;
    const playerName = this.props.playerName;
    const cards = Object.entries(this.props.cards).map(([color, cardArray]) => {
      const cardArrayFormatted = Object.values(cardArray).map(card => {
        return (
          <Grid.Row>
            <div>{card.color} : {card.points}</div>
            {this.renderPrice(card.price)}
          </Grid.Row>
        );
      });
      return (
        <Grid.Column>
          {cardArrayFormatted}
        </Grid.Column>
      );
    });
    const reserved = this.props.reserved.map((card, idx) => {
      const [color, points, prices] = [card.color, card.points, card.prices];
      return (
        <Grid.Row>
          <CardModal 
            source="reserved"
            index={idx}
            card={card}
            handleBuy={this.props.handleBuy}
          />
        </Grid.Row>
      )
    });

    return (
      <Modal
        onClose={() => this.setOpen(false)}
        onOpen={() => this.setOpen(true)}
        open={open}
        trigger={<Card className="mini">...</Card>}
      >
        <Modal.Header>
          <Grid columns={2}>
            <Grid.Column>{this.props.points}</Grid.Column>
            <Grid.Column textAlign="right">{playerName}</Grid.Column>
          </Grid>
        </Modal.Header>
        <Modal.Content>
          <Grid columns={6}>
            {cards}
            <Grid.Column>
              {reserved}
            </Grid.Column>
          </Grid>
        </Modal.Content>
        <Modal.Actions>
          <Button 
            color='black'
            content="Cancel"
            onClick={() => this.setOpen(false)}
          />
        </Modal.Actions>
      </Modal>
    );
  }

}