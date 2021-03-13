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
      for (let i = 0; i < 3; i++) {
        let cols = [];
        for (let j = 0; j < 4; j++) {
          let index = i * 4 + j;
          let card = cards[i][j];
          let color = card[0];
          let points = card[1];
          let price = card.slice(2,);
          cols.push(<CardModal index={index} color={color} points={points} price={price}/>);
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
    this.setState({open: open});
  }
  
  renderPrice(price) {
    let colorMap = ['white', 'blue', 'green', 'red', 'black'];
    let prices = [];
    for (let i = 0; i < price.length; i++) {
      if (price[i] > 0) {
        prices.push(
          <Grid.Row>
            <span >{colorMap[i]}</span>
            <span >{price[i]}</span>
          </Grid.Row>
        );
      }
    }
    return (prices);
  }
  
  render() {
    const {index, color, points, price} = this.props;
    const prices = this.renderPrice(price);
    const card = (
      <Card>
        <Card.Content className={color}>
          <Card.Header>
            <span className="leftHeader">{color}</span>
            <span className="rightHeader">{points}</span>
          </Card.Header>
          <Card.Description>{prices}</Card.Description>
        </Card.Content>
      </Card>
    );
    return (
      <Modal
        onClose={() => this.setOpen(false)}
        onOpen={() => this.setOpen(true)}
        open={this.state.open}
        trigger={card}
      >
        <Modal.Header>
          <span className="leftHeader">{color}</span>
          <span className="rightHeader">{points}</span>
        </Modal.Header>
        <Modal.Content>{prices}</Modal.Content>
        <Modal.Actions>
          <Button 
            color='black'
            content="Cancel"
            onClick={() => this.setOpen(false)}
          />
          <Button
            content="confirm"
            onClick={() => alert("CONFIRM")}
            positive
          />
        </Modal.Actions>
      </Modal>
    );
  }
}