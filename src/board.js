import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import decks from './cards';
import Bank from './bank';
import Noblemen from './noblemen';
import Player from './player';
import Wallet from './wallet';
import 'semantic-ui-css/semantic.min.css';
import { Grid, Card } from 'semantic-ui-react';


export default class Board extends React.Component {
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
    
    renderCard(i, color, points, price) {
      const prices = this.renderPrice(price);
      return (
        <Card onClick={() => this.props.onClick(i)}>
          <Card.Content className={color}>
            <Card.Header>
              <span className="leftHeader">{color}</span>
              <span className="rightHeader">{points}</span>
            </Card.Header>
            <Card.Description>{prices}</Card.Description>
          </Card.Content>
        </Card>
      );
    }
  
    render() {
      let decks = this.props.decks;
      
      let rows = [];
      for (let i = 0; i < 3; i++) {
        let cols = [];
        for (let j = 0; j < 4; j++) {
          let index = i * 4 + j;
          let card = decks[i].pop();
          let color = card[0];
          let points = card[1];
          let price = card.slice(2,);
          cols.push(this.renderCard(index, color, points, price));
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
  