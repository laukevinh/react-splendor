import React, { useState } from 'react';
import { Button, Grid, Modal } from 'semantic-ui-react'
import { GameCardModal } from './CardModal';
import DeckCard from './DeckCard';
import renderPrice, { GameCard } from '../utils';
import Coin from './Coin';

export default function Player(props) {
  const {
    player,
    currentPlayerIdx,
    finished,
    handleBuyClick
  } = props;

  const coins = Object.entries(player.coins).map(([color, count], idx) => {
    const coin = <Coin color={color}>{count}</Coin>;
    return <Grid.Column>{0 < count && coin}</Grid.Column>;
  });
  const cards = Object.entries(player.cards).map(([color, cardArray]) => {
    const card = <GameCard color={color}>{cardArray.length}</GameCard>;
    return <Grid.Column>{0 < cardArray.length && card}</Grid.Column>;
  });
  return (
    <Grid className={player.position === currentPlayerIdx && !finished ? "active-player" : null}>
      <Grid.Row columns={2}>
        <Grid.Column>{player.points}</Grid.Column>
        <Grid.Column textAlign="right">{player.name}</Grid.Column>
      </Grid.Row>
      <Grid.Row columns={6}>
        {coins}
      </Grid.Row>
      <Grid.Row columns={6}>
        {cards}
        <Grid.Column>
          <ModalPlayerDetails
            player={player}
            currentPlayerIdx={currentPlayerIdx}
            finished={finished}
            handleBuyClick={handleBuyClick}
          />
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
}

function ModalPlayerDetails(props) {
  const {
    player,
    currentPlayerIdx,
    finished,
    handleBuyClick,
  } = props;
  const [open, setOpen] = useState(false);

  const cards = Object.entries(player.cards).map(([color, cardArray]) => {
    const cardArrayFormatted = Object.values(cardArray).map(card => {
      return (
        <Grid.Row>
          <GameCard size="small" color={card.color}>{renderPrice(card.price, "coin")}</GameCard>
        </Grid.Row>
      );
    });
    return (
      <Grid.Column>
        {cardArrayFormatted}
      </Grid.Column>
    );
  });
  const reserved = player.reserved.map((card, idx) => {
    return (
      <Grid.Row>
        <GameCardModal
          index={idx}
          card={card}
          player={player}
          currentPlayerIdx={currentPlayerIdx}
          handleBuyClick={handleBuyClick}
          disabled={finished || currentPlayerIdx !== player.position}
        />
      </Grid.Row>
    )
  });

  return (
    <Modal
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(!finished)}
      open={open}
      trigger={<DeckCard size={'small'} />}
    >
      <Modal.Header>
        <Grid columns={2}>
          <Grid.Column>{player.points}</Grid.Column>
          <Grid.Column textAlign="right">{player.name}</Grid.Column>
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
          onClick={() => setOpen(false)}
        />
      </Modal.Actions>
    </Modal>
  );
}