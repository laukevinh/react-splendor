import React from 'react';
import './index.css';
import 'semantic-ui-css/semantic.min.css';
import { Grid, Card, Modal, Button } from 'semantic-ui-react';
import CardModal from './cardModal';


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
              source="board"
              level={level}
              column={col}
              card={card}
              handleBuy={this.props.handleBuy}
              handleReserve={this.props.handleReserve}
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