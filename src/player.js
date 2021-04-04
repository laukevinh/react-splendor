import React from 'react';
import { Button, Grid, Card, Modal } from 'semantic-ui-react'
import CardModal from './cardModal';
import renderPrice from './utils';
import { Coin, GameCard } from './utils';

export default class Player extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const coins = Object.entries(this.props.coins).map(([color, count], idx) => {
      const coin = <Coin color={color} content={count} />;
      return <Grid.Column>{0 < count && coin}</Grid.Column>;
    });
    const cards = Object.entries(this.props.cards).map(([color, cardArray]) => {
      const card = <GameCard color={color} content={cardArray.length} />;
      return <Grid.Column>{0 < cardArray.length && card}</Grid.Column>;
    });
    const activePlayer = this.props.activePlayer && !this.props.finished ? "active" : null;
    return (
      <Grid className={activePlayer}>
        <Grid.Row columns={2}>
          <Grid.Column>{this.props.points}</Grid.Column>
          <Grid.Column textAlign="right">{this.props.playerName}</Grid.Column>
        </Grid.Row>
        <Grid.Row columns={6}>
          {coins}
        </Grid.Row>
        <Grid.Row columns={6}>
          {cards}
          <Grid.Column>
            <ModalPlayerDetails {...this.props} />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}

class ModalPlayerDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
    };
  }

  setOpen(open) {
    if (!this.props.finished) {
      this.setState({open: open});
    }
  }

  render() {
    const open = this.state.open;
    const playerName = this.props.playerName;
    const cards = Object.entries(this.props.cards).map(([color, cardArray]) => {
      const cardArrayFormatted = Object.values(cardArray).map(card => {
        return (
          <Grid.Row>
            <GameCard size="small" color={card.color} content={renderPrice(card.price, "coin")} />
          </Grid.Row>
        );
      });
      return (
        <Grid.Column>
          {cardArrayFormatted}
        </Grid.Column>
      );
    });
    const reserved = this.props.reserved.map((card, idx) => {
      const [color, points, prices] = [card.color, card.points, card.prices];
      return (
        <Grid.Row>
          <CardModal 
            source="reserved"
            index={idx}
            card={card}
            handleBuy={this.props.handleBuy}
          />
        </Grid.Row>
      )
    });

    return (
      <Modal
        onClose={() => this.setOpen(false)}
        onOpen={() => this.setOpen(true)}
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
            <Grid.Column>{this.props.points}</Grid.Column>
            <Grid.Column textAlign="right">{playerName}</Grid.Column>
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
            onClick={() => this.setOpen(false)}
          />
        </Modal.Actions>
      </Modal>
    );
  }

}