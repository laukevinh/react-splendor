import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import 'semantic-ui-css/semantic.min.css';
import Game from './app/Game';

// ========================================

ReactDOM.render(
  <Game numPlayers={2} pointsToWin={3} />,
  document.getElementById('root')
);
