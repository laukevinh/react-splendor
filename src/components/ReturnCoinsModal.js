import React from 'react';
import Wallet from './Wallet';
import { Coin } from '../utils';
import { Button, Grid, Modal } from 'semantic-ui-react';

export default class ReturnCoinsModal extends React.Component {
  constructor(props) {
    super(props);
    this.handleCoinTake = this.handleCoinTake.bind(this);
    this.handleCoinReturn = this.handleCoinReturn.bind(this);
    this.state = {
      open: false,
      playerCoins: props.coins,
      numPlayerCoins: props.coins.sum(),
      tempCoins: new Wallet(),
      refreshState: true,
    }
  }

  componentDidUpdate() {
    if (!this.props.finished && this.props.open && this.state.refreshState) {
      this.setState({
        playerCoins: this.props.coins,
        numPlayerCoins: this.props.coins.sum(),
        tempCoins: new Wallet(),
        refreshState: false,
      });
    }
  }

  setAllObjValues(obj, value) {
    for (let key of Object.keys(obj)) {
      obj[key] = value;
    }
  }

  handleCoinTake(colorToTake) {
    let playerCoins = Object.assign({}, this.state.playerCoins);
    let tempCoins = Object.assign({}, this.state.tempCoins);
    playerCoins[colorToTake]--;
    tempCoins[colorToTake]++;
    this.setState({
      playerCoins: playerCoins,
      tempCoins: tempCoins,
      numPlayerCoins: this.state.numPlayerCoins - 1,
    });
  }

  handleCoinReturn(colorToReturn) {
    let playerCoins = Object.assign({}, this.state.playerCoins);
    let tempCoins = Object.assign({}, this.state.tempCoins);
    playerCoins[colorToReturn]++;
    tempCoins[colorToReturn]--;
    this.setState({
      playerCoins: playerCoins,
      tempCoins: tempCoins,
      numPlayerCoins: this.state.numPlayerCoins + 1,
    });
  }

  handleConfirm(coins) {
    this.setState({
      tempCoins: new Wallet(),
      open: false,
      refreshState: true,
    });  // reset temp coins
    this.props.handleReturnCoins(coins);
  }

  render() {
    let open = this.props.open;

    const coins = Object.entries(this.state.playerCoins).map(([color, count], idx) => {
      const disabled = count <= 0;
      const playerCoinButton = <Coin color={color} content={count} disabled={disabled} onClick={this.handleCoinTake} />;
      const tempCoinButton = <Coin color={color} content={this.state.tempCoins[color]} onClick={this.handleCoinReturn} />;
      return (
        <Grid.Row>
          {playerCoinButton}
          {this.state.tempCoins[color] > 0 && tempCoinButton}
        </Grid.Row>
      );
    });

    return (
      <Modal
        className="bank"
        onClose={() => alert("you must return down to 10 coins")}
        onOpen={() => alert("modal opened")}
        open={open}
        trigger={null}
      >
        <Modal.Header>Return down to 10 coins</Modal.Header>
        <Modal.Content>{coins}</Modal.Content>
        <Modal.Actions>
          <Button
            content="confirm"
            onClick={() => this.handleConfirm(this.state.tempCoins)}
            positive
            disabled={10 < this.state.numPlayerCoins}
          />
        </Modal.Actions>
      </Modal>
    );
  }
}