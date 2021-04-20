import React from 'react';
import './index.css';
import 'semantic-ui-css/semantic.min.css';
import { Grid, Card, Modal, Button } from 'semantic-ui-react';
import CardModal from './cardModal';
import DeckModal from './deckModal';


export default class Board extends React.Component {
    constructor(props) {
      super(props);
    }
  
    render() {
      let cards = this.props.cards;
      let rows = [];
      for (let level = 0; level < 3; level++) {
        let deck = this.props.decks[level];
        let deckModal = (
          <DeckModal
            source="deck"
            level={level}
            deck={deck}
            handleReserve={this.props.handleReserve}
            finished={this.props.finished}
          />
        );
        let cols = [];
        for (let col = 0; col < 4; col++) {
          let card = cards[level][col];
          if (card === null) {
            cols.push(null);
          } else {
            cols.push(
              <CardModal 
                source="board"
                level={level}
                column={col}
                card={card}
                playerWallet={this.props.playerWallet}
                playerCards={this.props.playerCards}
                handleBuy={this.props.handleBuy}
                handleReserve={this.props.handleReserve}
                finished={this.props.finished}
              />
            );
          }
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
  }