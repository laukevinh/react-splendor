import React from 'react';
import './index.css';
import 'semantic-ui-css/semantic.min.css';
import { Grid, Card, Modal, Button } from 'semantic-ui-react';
import { Coin, GameCard } from './utils';

export default class DeckModal extends React.Component {
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
  
  handleReserve(source, level, column, card) {
    this.setState({open: false});
    this.props.handleReserve(source, level, column, card); //assume props is okay, don't need to use state
  }
  
  render() {
    const { source, level, deck } = this.props;
    const color = 'beige';
    const card = deck[deck.length - 1];
    const selectable = 0 < deck.length ? 'selectable' : 'disabled';
    const cardComponent = (
      <div className={["game-card", "mini", selectable, color].join(" ")}>
        <Grid.Row>...</Grid.Row>
        <Grid.Row>{deck.length}</Grid.Row>
      </div>
    );
    return (
      <Modal
        onClose={() => this.setOpen(false)}
        onOpen={() => this.setOpen(true)}
        open={this.state.open}
        trigger={cardComponent}
      >
        <Modal.Header>Level {level}</Modal.Header>
        <Modal.Content>Remaining: {deck.length}</Modal.Content>
        <Modal.Actions>
          <Button 
            color='black'
            content="Cancel"
            onClick={() => this.setOpen(false)}
          />
          <Button
            color='yellow'
            content="Reserve"
            onClick={() => this.handleReserve(source, level, null, card)}
          />
        </Modal.Actions>
      </Modal>
    );
  }
}