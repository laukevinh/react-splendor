import React, { useState } from 'react';
import { Card, Modal, Button } from 'semantic-ui-react';
import { BOARD, calculateCharge, RESERVED, DECK } from '../utils';
import GameCard from './GameCard';
import DeckCard from './DeckCard';
import { MAX_PLAYER_RESERVATION } from '../constants/defaults';

export function DeckModal(props) {
  const {
    level,
    deck,
    onClick,
    players,
    currentPlayerIdx,
    disabled
  } = props;
  const [open, setOpen] = useState(false);
  const currentPlayer = players[currentPlayerIdx];

  const handleReserve = () => {
    setOpen(false);
    onClick(level);
  }

  return (
    <Modal
      size={'mini'}
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open && !disabled}
      trigger={<DeckCard size={'small'}>{deck.length}</DeckCard>}
    >
      <Modal.Content>
        <DeckCard
          size={'large'}
          fluid
        >
          {deck.length}
        </DeckCard>
      </Modal.Content>
      <Modal.Actions>
        <Button
          color='black'
          content="Cancel"
          onClick={() => setOpen(false)}
        />
        <Button
          color='yellow'
          content="Reserve"
          disabled={MAX_PLAYER_RESERVATION <= currentPlayer.reserved.length}
          onClick={() => handleReserve()}
        />
      </Modal.Actions>
    </Modal>
  )
}

export function GameCardModal(props) {
  const {
    level,
    column,
    deck,
    card,
    handleReserveClick,
    handleBuyClick,
    players,
    currentPlayerIdx,
    disabled
  } = props;
  const [open, setOpen] = useState(false);
  const currentPlayer = players[currentPlayerIdx];
  const insufficientFunds = calculateCharge(card.price, currentPlayer.coins, currentPlayer.cards).insufficientFunds;

  const handleBuy = () => {
    setOpen(false);
    let index = null;
    handleBuyClick(BOARD, level, column, index, card);
  }

  const handleReserve = () => {
    setOpen(false);
    handleReserveClick(level, column);
  }

  return (
    <Modal
      size={'mini'}
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open && !disabled}
      trigger={<GameCard card={card} size={'medium'} />}
    >
      <Modal.Content>
        <GameCard card={card} size={'large'} fluid />
      </Modal.Content>
      <Modal.Actions>
        <Button
          color='black'
          content="Cancel"
          onClick={() => setOpen(false)}
        />
        <Button
          color='yellow'
          content="Reserve"
          disabled={MAX_PLAYER_RESERVATION <= currentPlayer.reserved.length}
          onClick={() => handleReserve()}
        />
        <Button
          content="Buy"
          disabled={insufficientFunds}
          onClick={() => handleBuy()}
          positive
        />
      </Modal.Actions>
    </Modal>
  )
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