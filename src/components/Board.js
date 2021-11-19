import React from 'react';
import { Grid, Card } from 'semantic-ui-react';
import { pricetag } from '../utils';
import { DeckModal, GameCardModal } from './CardModal';

export default function Board(props) {
  const {
    board,
    decks,
    players,
    currentPlayerIdx,
    handleBuyFromBoard,
    handleReserveFromDeck,
    handleReserveFromBoard,
    finished
  } = props;
  // TODO empty array into a placeholder deck card
  // TODO turn null into a placeholder game card
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
        <GameCardModal
          key={pricetag(card)}
          level={level}
          column={col}
          card={card}
          player={players[currentPlayerIdx]}
          currentPlayerIdx={currentPlayerIdx}
          handleBuyClick={handleBuyFromBoard}
          handleReserveClick={handleReserveFromBoard}
          disabled={finished}
        />
      );
    });
    return (
      <Grid.Row columns={2} key={level}>
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
    <Grid>{rows.reverse()}</Grid>
  );
}