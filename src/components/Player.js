import React, { useState } from 'react';
import { Button, Grid, Modal } from 'semantic-ui-react'
import CardModal from './CardModal';
import renderPrice, { GameCard, RESERVED } from '../utils';
import Coin from './Coin';

export default function Player(props) {
  const {
    player,
    activePlayer,
    finished,
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
    <Grid className={activePlayer && !finished ? "active-player" : null}>
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
          <ModalPlayerDetails {...props} />
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
}

function ModalPlayerDetails(props) {
  const {
    player,
    finished,
    handleBuy
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
        <CardModal
          source={RESERVED}
          index={idx}
          card={card}
          playerWallet={player.coins}
          playerCards={player.cards}
          handleBuy={handleBuy}
        />
      </Grid.Row>
    )
  });

  return (
    <Modal
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(!finished)}
      open={open}
      trigger={<div className="game-card mini selectable">...</div>}
    // trigger={<div>...</div>}
    // using divs, even an empty div, will work as a modal trigger. But the below GameCard component doesn't work.
    // Semantic-UI calls react.isValidElement() on the trigger. If it isn't a valid element, it returns null and does nothing
    // that's why using GameCard doesn't work? it's still returning a div... anyway.
    // https://reactjs.org/docs/react-api.html#isvalidelement
    // https://github.com/Semantic-Org/Semantic-UI-React/blob/ff703557a3090ea281cb7a263bc486a978fbabdd/src/modules/Modal/Modal.js#L215
    // trigger={<GameCard color="wild" selectable content="..." />}
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