import React from 'react';
import { Grid, Card } from 'semantic-ui-react';
import CardModal, { DeckModal } from './CardModal';
import { DECK, BOARD } from '../utils';

export default function Board(props) {
  const {
    board,
    decks,
    players,
    currentPlayerIdx,
    handleReserveFromDeck,
    finished
  } = props;

  let rows = board.map((row, level) => {
    let deckModal = (
      <DeckModal
        level={level}
        deck={decks[level]}
        onClick={handleReserveFromDeck}
        players={players}
        currentPlayerIdx={currentPlayerIdx}
        disabled={finished}
      />
    );
    let cols = row.map((card, col) => {
      return (
        <CardModal
          source={BOARD}
          level={level}
          column={col}
          card={card}
          playerWallet={props.playerWallet}
          playerCards={props.playerCards}
          handleBuy={props.handleBuy}
          handleReserve={props.handleReserve}
          finished={finished}
        />
      );
    });
    return (
      <Grid.Row columns={2}>
        <Grid.Column width={1}>
          {deckModal}
        </Grid.Column>
        <Grid.Column width={15}>
          <Card.Group itemsPerRow={4}>
            {cols}
          </Card.Group>
        </Grid.Column>
      </Grid.Row>
    );
  });
  return (
    <Grid>{rows}</Grid>
  );
}