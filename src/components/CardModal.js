import React from 'react';
import { Card, Modal, Button } from 'semantic-ui-react';
import renderPrice, { BOARD, calculateCharge, RESERVED, DECK } from '../utils';
import ColorIcon from './ColorIcon';

export function GameCard(props) {
  const {
    card,
    size
  } = props;
  let classNames = [card.color];
  if (size) {
    classNames.push(size);
  }
  return (
    <Card {...props}>
      <Card.Content className={classNames.join(" ")}>
        <ColorIcon
          color={card.color}
          floated={'left'}
          size={size || 'medium'}
        />
        <Card.Header textAlign="right" className={"pointValue"}>
          {card.points}
        </Card.Header>
        <Card.Description>
          {renderPrice(card.price, "coin")}
        </Card.Description>
      </Card.Content>
    </Card>
  );
}

function DeckCard(props) {
  const {
    size,
    fluid,
    onClick,
    disabled,
    children
  } = props;
  let classNames = ['deck-card', 'beige'];
  if (size) {
    classNames.push(size);
  }
  if (fluid) {
    classNames.push('fluid');
  }
  if (onClick) {
    classNames.push('selectable');
  }
  if (disabled) {
    classNames.push('disabled');
  }
  return (
    <div className={classNames.join(" ")} {...props}>
      <div>{'...'}</div>
      <div>{children}</div>
    </div>
  );
}

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
    let cardComponent;
    let modalContent;
    let buyButton;
    if (source === BOARD || source === RESERVED) {
      if (typeof card === "undefined") {
        cardComponent = <Card content={'...'} />;
      } else {
        cardComponent = <GameCard card={card} size={'medium'} />;
        modalContent = <GameCard card={card} size={'large'} fluid />;
        // TODO: BUG: you can buy another player's reserved card.
        const insufficientFunds = calculateCharge(card.price, playerWallet, playerCards).insufficientFunds;
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
      cardComponent = <DeckCard size={'small'}>{deck.length}</DeckCard>;
      modalContent = <DeckCard size={'large'} fluid>{deck.length}</DeckCard>;
      column = null;
      card = deck[deck.length - 1];
    }
    return (
      <Modal
        size={'mini'}
        onClose={() => this.setOpen(false)}
        onOpen={() => this.setOpen(true)}
        open={this.state.open}
        trigger={cardComponent}
      >
        <Modal.Content>
          {modalContent}
        </Modal.Content>
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