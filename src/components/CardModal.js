import React, { useState } from 'react';
import { Modal, Button } from 'semantic-ui-react';
import { isAbleToBuy } from '../utils';
import GameCard from './GameCard';
import { MAX_PLAYER_RESERVATION } from '../constants/defaults';
import MiniCard from './MiniCard';

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

  const triggerComponent = (
    <MiniCard size={'small'}>
      <div>{'...'}</div>
      <div>{deck.length}</div>
    </MiniCard>
  );

  return (
    <Modal
      size={'mini'}
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open && !disabled}
      trigger={triggerComponent}
    >
      <Modal.Content>
        <MiniCard
          size={'large'}
          fluid
        >
          {'...'}
          {deck.length}
        </MiniCard>
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
    index,
    card,
    handleReserveClick,
    handleBuyClick,
    player,
    currentPlayerIdx,
    disabled
  } = props;
  const [open, setOpen] = useState(false);

  const handleBuy = () => {
    setOpen(false);
    if (index === undefined) {
      handleBuyClick(level, column);
    } else {
      handleBuyClick(index);
    }
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
        {
          handleReserveClick &&
          <Button
            color='yellow'
            content="Reserve"
            disabled={MAX_PLAYER_RESERVATION <= player.reserved.length}
            onClick={() => handleReserve()}
          />
        }
        {
          currentPlayerIdx === player.position &&
          card !== null &&
          <Button
            content="Buy"
            disabled={!isAbleToBuy(card, player)}
            onClick={() => handleBuy()}
            positive
          />
        }
      </Modal.Actions>
    </Modal>
  )
}