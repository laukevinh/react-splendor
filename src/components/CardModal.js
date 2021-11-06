import React from 'react';
import { Grid, Card, Modal, Button } from 'semantic-ui-react';
import renderPrice, { BOARD, calculateCharge, RESERVED, DECK, GameCard } from '../utils';
import Coin from '../objects/Coin';

export default class CardModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
    };
  }

  setOpen(open) {
    if (!this.props.finished) {
      this.setState({ open: open });
    }
  }

  handleReserve(source, level, column, card) {
    this.setState({ open: false });
    this.props.handleReserve(source, level, column, card); //assume props is okay, don't need to use state
  }

  handleConfirm(source, level, column, index, card) {
    this.setState({ open: false });
    this.props.handleBuy(source, level, column, index, card); //assume props is okay, don't need to use state
  }

  render() {
    let { source, level, column, index, card, playerWallet, playerCards, deck } = this.props;
    let color;
    let cardComponent;
    let modalHeader;
    let modalContent;
    let buyButton;
    if (source === BOARD || source === RESERVED) {
      if (typeof card === "undefined") {
        cardComponent = <Card />;
      } else {
        color = card.color;
        let points = card.points;
        let price = card.price;
        const prices = renderPrice(price, "coin");
        cardComponent = (
          <Card>
            <Card.Content className={color}>
              <Card.Header>
                <Grid>
                  <Grid.Row columns={2}>
                    <Grid.Column><Coin color={color} /></Grid.Column>
                    <Grid.Column textAlign="right">{points}</Grid.Column>
                  </Grid.Row>
                </Grid>
              </Card.Header>
              <Card.Description>
                {prices}
              </Card.Description>
            </Card.Content>
          </Card>
        );
        // TODO: BUG: you can buy another player's reserved card.
        const insufficientFunds = calculateCharge(price, playerWallet, playerCards).insufficientFunds;
        modalHeader = (
          <Grid>
            <Grid.Row columns={2}>
              <Grid.Column><Coin color={color} size='mini' /></Grid.Column>
              <Grid.Column textAlign="right">{points}</Grid.Column>
            </Grid.Row>
          </Grid>
        );
        modalContent = prices;
        buyButton = (
          <Button
            content="Buy"
            disabled={insufficientFunds}
            onClick={() => this.handleConfirm(source, level, column, index, card)}
            positive
          />
        );
      }
    } else if (source === DECK) {
      color = 'beige';
      card = deck[deck.length - 1];
      const selectable = 0 < deck.length ? 'selectable' : 'disabled';
      cardComponent = (
        <div className={["game-card", "mini", selectable, color].join(" ")}>
          <Grid.Row>...</Grid.Row>
          <Grid.Row>{deck.length}</Grid.Row>
        </div>
      );
      modalHeader = `Level ${level}`;
      modalContent = `Remaining: ${deck.length}`;
      column = null;
    }
    return (
      <Modal
        onClose={() => this.setOpen(false)}
        onOpen={() => this.setOpen(true)}
        open={this.state.open}
        trigger={cardComponent}
      >
        <Modal.Header>{modalHeader}</Modal.Header>
        <Modal.Content>{modalContent}</Modal.Content>
        <Modal.Actions>
          <Button
            color='black'
            content="Cancel"
            onClick={() => this.setOpen(false)}
          />
          <Button
            color='yellow'
            content="Reserve"
            disabled={source === RESERVED}
            onClick={() => this.handleReserve(source, level, column, card)}
          />
          {buyButton}
        </Modal.Actions>
      </Modal>
    );
  }
}