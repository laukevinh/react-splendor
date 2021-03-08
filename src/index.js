import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import decks from './cards';
import Bank from './bank';
import Noblemen from './noblemen';
import 'semantic-ui-css/semantic.min.css';
import { Grid, Card } from 'semantic-ui-react';

function Color(props) {
  let icons = {
    white: "^",
    blue: "{}",
    green: "<>",
    red: "<3",
    black: "+"
  };
  return (
    <div className={"color"}>
      {icons[props.value]}
    </div>
  );
}

function Point(props) {
  return (
    <div classname={"point"}>
      {props.value}
    </div>
  )
}

function Price(props) {
  let colorMap = ['white', 'blue', 'green', 'red', 'black'];
  let price = [];
  for (let k = 0; k < props.value.length; k++) {
    if (props.value[k] !== 0) {
      let disp = (
        <div>
          <div style={{float: "left"}}>{props.value[k]}</div>
          <Color value={colorMap[k]}/>
        </div>
      );
      price.push(disp);
    }
  }
  return (
    <div className="price">
      <div>Price:</div>
      {price}
    </div>
  );
}

// function Card(props) {
//   return (
//     <button 
//       className={"card " + props.color}
//       onClick={() => alert('hold or buy')}
//     >
//       <Color value={props.color} />
//       <Point value={props.points} />
//       <Price value={props.price} />
//     </button>
//   );
// }

function calculateWinner(players) {
  let hiscore = 0;
  let winner = null;
  for (let i = 0; i < players.length; i++) {
    if (21 < players[i].score && hiscore <= players[i].score) {
      hiscore = players[i].score;
      winner = players[i];
    }
  }
  return winner;
}

class Board extends React.Component {
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

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        cards: [Array(4), Array(4), Array(4)],
        players: [],
      }],
      stepNumber: 0,
      moveHistory: [null],
      historyReversed: false,
      xIsNext: true,
      cards: [Array(4), Array(4), Array(4)],
      decks: [
        this.shuffle(decks[0]),
        this.shuffle(decks[1]),
        this.shuffle(decks[2]),
      ],
      numPlayers: props.numPlayers,
    };
  }

  shuffle(A) {
    function randInt(i, j) {
      return Math.floor(Math.random() * (j - i) + i);
    }
    function swap(A, i, j) {
      let temp = A[i];
      A[i] = A[j];
      A[j] = temp;
    }
    let n = A.length;
    for (let k = 0; k < n; k++) {
      swap(A, k, randInt(0, n - 1));
    }
    return A;
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const moveHistory = this.state.moveHistory.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    const players = [];
    if (calculateWinner(players)) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
      }]),
      stepNumber: history.length,
      moveHistory: moveHistory.concat(i),
      xIsNext: !this.state.xIsNext,
    });
  }

  render() {
    const history = this.state.history;
    const moveHistory = this.state.moveHistory;
    const current = history[this.state.stepNumber];
    const players = [];
    const winner = calculateWinner(players);

    let moves = history.map((step, move) => { //move is the index
      const col = moveHistory[move] % 3;
      const row = Math.floor(moveHistory[move] / 3);
      const desc = move ?
        "Go to move #" + move + " (" + col + ", " + row + ")" :
        "Go to game start";
      return (
        <li key={move}>
          <button 
            className={(move === this.state.stepNumber) ? "bold" : ""}
          >
            {desc}
          </button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = "Winner: " + winner.token;
    } else if (this.state.stepNumber > 8) {
      status = "Cat's game!";
    } else {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    }

    const maxCoins = {
      2: 4,
      3: 5,
      4: 7,
    };

    return (
      <Grid>
          <Grid.Column width={2} className="bank">
            <Bank 
              maxCoins={maxCoins[this.state.numPlayers]}
            />
          </Grid.Column>
          <Grid.Column width={7} className="game-board">
            <Grid.Row>
              <Noblemen />
            </Grid.Row>
            <Grid.Row>
              <Board 
                squares={current.squares}
                cards={current.cards}
                winner={winner}
                decks={this.state.decks}
                onClick={(i) => this.handleClick(i)}
              />
            </Grid.Row>
          </Grid.Column>
          <Grid.Column width={5} className="game-info">
            <div>{status}</div>
            <ol>{moves}</ol>
          </Grid.Column>
      </Grid>
    ); // is the entire ordered list of moves getting re-rendered? or only what has changed?
  }
}

// ========================================

ReactDOM.render(
  <Game numPlayers={2}/>,
  document.getElementById('root')
);
