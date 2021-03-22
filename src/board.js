import React from 'react';
import './index.css';
import 'semantic-ui-css/semantic.min.css';
import { Grid, Card, Modal, Button } from 'semantic-ui-react';


export default class Board extends React.Component {
    constructor(props) {
      super(props);
    }
  
    render() {
      let cards = this.props.cards;
      let rows = [];
      for (let level = 0; level < 3; level++) {
        let cols = [];
        for (let col = 0; col < 4; col++) {
          let card = cards[level][col];
          cols.push(
            <CardModal 
              level={level}
              column={col}
              card={card}
              handleBuy={this.props.handleBuy}
              finished={this.props.finished}
            />
          );
        }
        rows.push(
          <Card.Group itemsPerRow={4}>{cols}</Card.Group>
        );
      }
      return (
        <div>{rows}</div>
      );
    }
  }

class CardModal extends React.Component {
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
  
  renderPrice(price) {
    let prices = [];
    for (let [color, colorPrice] of Object.entries(price)) {
      if (colorPrice > 0) {
        prices.push(
          <Grid.Row>
            <div className={"coin " + color}>
              {colorPrice}
            </div>
          </Grid.Row>
        );
      }
    }
    return (prices);
  }
  
  handleConfirm(level, column, card) {
    this.setState({open: false});
    this.props.handleBuy(level, column, card); //assume props is okay, don't need to use state
  }
  
  render() {
    const { level, column, card } = this.props;
    const { color, points, price } = card;
    const prices = this.renderPrice(price);
    const cardComponent = (
      <Card>
        <Card.Content className={color}>
          <Card.Header>
            <Grid>
              <Grid.Row columns={2}>
                <Grid.Column>{color}</Grid.Column>
                <Grid.Column textAlign="right">{points}</Grid.Column>
              </Grid.Row>
            </Grid>
          </Card.Header>
          <Card.Description>
            {prices}
          </Card.Description>
        </Card.Content>
      </Card>
    );
    return (
      <Modal
        onClose={() => this.setOpen(false)}
        onOpen={() => this.setOpen(true)}
        open={this.state.open}
        trigger={cardComponent}
      >
        <Modal.Header>
          <Grid>
            <Grid.Row columns={2}>
              <Grid.Column>{color}</Grid.Column>
              <Grid.Column textAlign="right">{points}</Grid.Column>
            </Grid.Row>
          </Grid>
        </Modal.Header>
        <Modal.Content>{prices}</Modal.Content>
        <Modal.Actions>
          <Button 
            color='black'
            content="Cancel"
            onClick={() => this.setOpen(false)}
          />
          <Button
            content="Buy"
            onClick={() => this.handleConfirm(level, column, card)}
            positive
          />
        </Modal.Actions>
      </Modal>
    );
  }
}