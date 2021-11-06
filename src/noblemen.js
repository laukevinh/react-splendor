import React from 'react';
import { Grid, Modal } from 'semantic-ui-react';
import Price from './components/Price';

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

class NobleBase {
  constructor(points, white, blue, green, red, black, isDisplayed) {
    this.points = points;
    this.price = new Price(white, blue, green, red, black);
    this.isDisplayed = isDisplayed;
  }
}

export const allNoblemen = nobles.map(([points, white, blue, green, red, black]) => new NobleBase(points, white, blue, green, red, black, true));

function Noble(props) {
  const isDisplayed = props.isDisplayed;
  const selectable = props.selectable ? "selectable" : "";
  const classNames = ["noble", selectable].join(" ");
  return isDisplayed ? (
    <div className={classNames}>
      <Grid.Row>
        VP: {props.points}
      </Grid.Row>
      {renderPrice(props.price, "game-card")}
    </div>
  ) : (
    <></>
  );
}

export default class Noblemen extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    const noblemen = this.props.noblemen.map(noble => {
      return (
        <Grid.Column>
          <Noble
            points={noble.points}
            price={noble.price}
            isDisplayed={noble.isDisplayed}
          />
        </Grid.Column>
      );
    });

    return (
      <Grid columns={this.props.noblemen.length}>
        {noblemen}
      </Grid>
    );
  }
}

export class ModalNoblemen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: props.open,
    };
  }

  handleConfirm(nobleIndex) {
    this.setState({ open: false });
    this.props.handleNoblemenSelection(nobleIndex);
  }

  handleSelect(index) {
    this.setState({ selectedNoble: index });
  }

  render() {
    // noblemen only contains the ones you're qualified to select
    const noblemen = this.props.selectableNoblemen.map((selectable, idx) => {
      const noble = this.props.noblemen[idx];
      return selectable ? (
        <Grid.Column onClick={() => this.handleConfirm(idx)}>
          <Noble
            points={noble.points}
            price={noble.price}
            isDisplayed={noble.isDisplayed}
            selectable
          />
        </Grid.Column>
      ) : (
        <Grid.Column></Grid.Column>
      )
    });

    return (
      <Modal open={this.props.open}>
        <Modal.Header>Select Noble</Modal.Header>
        <Modal.Content>
          <Grid columns={noblemen.length}>
            {noblemen}
          </Grid>
        </Modal.Content>
      </Modal>
    );
  }
}