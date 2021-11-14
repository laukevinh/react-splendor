import React from 'react';
import { Grid, Card } from 'semantic-ui-react';
import CardModal from './CardModal';
import { DECK, BOARD } from '../utils';
import { MAX_BOARD_COLS, MAX_BOARD_ROWS } from '../constants/defaults';

export default function Board(props) {
  let cards = props.cards;
  let rows = [];
  for (let level = 0; level < MAX_BOARD_ROWS; level++) {
    let deck = props.decks[level];
    let deckModal = (
      <CardModal
        source={DECK}
        level={level}
        deck={deck}
        handleReserve={props.handleReserve}
        finished={props.finished}
      />
    );
    let cols = [];
    for (let col = 0; col < MAX_BOARD_COLS; col++) {
      let card = cards[level][col];
      cols.push(
        <CardModal
          source={BOARD}
          level={level}
          column={col}
          card={card}
          playerWallet={props.playerWallet}
          playerCards={props.playerCards}
          handleBuy={props.handleBuy}
          handleReserve={props.handleReserve}
          finished={props.finished}
        />
      );
    }
    rows.push(
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
  }
  return (
    <Grid>{rows}</Grid>
  );
}