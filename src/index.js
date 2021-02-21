import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button 
      className={"square" + (props.bold ? " bold" : "")}
      onClick={props.onClick}
    >
      {props.value}
    </button>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {
        token: squares[a],
        line: lines[i]
      };
    }
  }
  return null;
}

class Board extends React.Component {  
  renderSquare(i, bold) {
    return (
      <Square 
        value={this.props.squares[i]}
        bold={bold}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    let line;
    if (this.props.winner) {
      line = this.props.winner.line;
    } else {
      line = Array(3).fill(null);
    }
    
    let rows = [];
    for (let i = 0; i < 3; i++) {
      let cols = [];
      for (let j = 0; j < 3; j++) {
        let index = i * 3 + j;
        let bold = (index === line[0] || index === line[1] || index === line[2]);
        cols.push(this.renderSquare(index, bold))
      }
      let row = <div className="board-row">{cols}</div>
      rows.push(row)
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
        squares: Array(9).fill(null),
      }],
      stepNumber: 0,
      moveHistory: [null],
      historyReversed: false,
      xIsNext: true,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const moveHistory = this.state.moveHistory.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
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

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  handleReverse() {
    this.setState({
      historyReversed: !this.state.historyReversed,
    })
  }

  render() {
    const history = this.state.history;
    const moveHistory = this.state.moveHistory;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

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
            onClick={() => this.jumpTo(move)}>{desc}
          </button>
        </li>
      );
    });

    if (this.state.historyReversed) {
      moves = moves.reverse();
    }

    let status;
    if (winner) {
      status = "Winner: " + winner.token;
    } else if (this.state.stepNumber > 8) {
      status = "Cat's game!";
    } else {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board 
            squares={current.squares}
            winner={winner}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <button onClick={() => this.handleReverse()}>
            Toggle order
          </button>
          <ol>{moves}</ol>
        </div>
      </div>
    ); // is the entire ordered list of moves getting re-rendered? or only what has changed?
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
