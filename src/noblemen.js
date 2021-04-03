import React from 'react';
import { Grid } from 'semantic-ui-react';
import renderPrice from './utils'

var VP = 3;

// var nobles = [
//   [VP, 3, 3, 3, 0, 0],
//   [VP, 0, 3, 3, 3, 0],
//   [VP, 0, 0, 3, 3, 3],
//   [VP, 3, 0, 0, 3, 3],
//   [VP, 3, 3, 0, 0, 3],
//   [VP, 4, 4, 0, 0, 0],
//   [VP, 0, 4, 4, 0, 0],
//   [VP, 0, 0, 4, 4, 0],
//   [VP, 0, 0, 0, 4, 4],
//   [VP, 4, 0, 0, 0, 4]
// ];
var nobles = [
  [VP, 1, 0, 0, 0, 0],
  [VP, 0, 1, 0, 0, 0],
  [VP, 0, 0, 1, 0, 0],
  [VP, 0, 0, 0, 1, 0],
  [VP, 0, 0, 0, 0, 1],
  [VP, 1, 0, 0, 0, 0],
  [VP, 0, 1, 0, 0, 0],
  [VP, 0, 0, 1, 0, 0],
  [VP, 0, 0, 0, 1, 0],
  [VP, 0, 0, 0, 0, 1],
];

function convertToObj(array) {
  return {
    'points': array[0],
    'price': {
      'white': array[1],
      'blue': array[2],
      'green': array[3],
      'red': array[4],
      'black': array[5]
    },
  }
}

export const allNoblemen = nobles.map(noble => convertToObj(noble));

export default class Noblemen extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    const noblemen = this.props.noblemen.map(noble => {
      return (
        <Grid.Column>
          <Grid.Row>
            VP: {noble.points}
          </Grid.Row>
          {renderPrice(noble.price)}
        </Grid.Column>
      )
    });
    
    return (
      <Grid columns={this.props.noblemen.length}>
        {noblemen}
      </Grid>
    );
  }
}