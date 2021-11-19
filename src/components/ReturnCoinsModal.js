import React from 'react';
import { CoinWallet } from '../objects/Wallet';
import { Button, Grid, Modal } from 'semantic-ui-react';
import Coin from './Coin';

export default class ReturnCoinsModal extends React.Component {
  constructor(props) {
    super(props);
    this.handleGiveToBank = this.handleGiveToBank.bind(this);
    this.handleReturnToPlayer = this.handleReturnToPlayer.bind(this);
    this.state = {
      playerCoins: props.coins,
      numPlayerCoins: props.coins.sum(),
      tempCoins: new CoinWallet(),
    }
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.open && this.props.open) {
      this.setState({
        playerCoins: this.props.coins,
        numPlayerCoins: this.props.coins.sum(),
        tempCoins: new CoinWallet(),
      });
    }
  }

  handleCoinMovement(color, isGiveToBank) {
    const {
      playerCoins,
      tempCoins
    } = this.state;

    let newPlayerCoins = Object.assign(new CoinWallet(), playerCoins);
    let newTempCoins = Object.assign(new CoinWallet(), tempCoins);
    if (isGiveToBank) {
      newPlayerCoins[color]--;
      newTempCoins[color]++;
    } else {
      newPlayerCoins[color]++;
      newTempCoins[color]--;
    }

    this.setState({
      playerCoins: newPlayerCoins,
      tempCoins: newTempCoins,
      numPlayerCoins: newPlayerCoins.sum(),
    });
  }

  handleGiveToBank(color) {
    this.handleCoinMovement(color, true);
  }

  handleReturnToPlayer(color) {
    this.handleCoinMovement(color, false);
  }

  handleConfirm(coins) {
    this.props.handleCoinTransaction(coins, false);
    this.setState({
      tempCoins: new CoinWallet(),
    });
  }

  render() {
    const { open } = this.props;
    const {
      playerCoins,
      numPlayerCoins,
      tempCoins
    } = this.state;

    const coins = Object.entries(playerCoins).map(([color, count], idx) => {
      const disabled = count <= 0;
      const playerCoinButton = (
        <Coin
          color={color}
          disabled={disabled}
          onClick={this.handleGiveToBank}
        >
          {count}
        </Coin>
      );
      const tempCoinButton = (
        <Coin
          color={color}
          onClick={this.handleReturnToPlayer}
        >
          {tempCoins[color]}
        </Coin>
      );
      return (
        <Grid.Row key={color}>
          {playerCoinButton}
          {
            tempCoins[color] > 0 &&
            tempCoinButton
          }
        </Grid.Row>
      );
    });

    return (
      <Modal
        className="bank"
        open={open}
        trigger={null}
      >
        <Modal.Header>Return down to 10 coins</Modal.Header>
        <Modal.Content>{coins}</Modal.Content>
        <Modal.Actions>
          <Button
            content="confirm"
            onClick={() => this.handleConfirm(tempCoins)}
            positive
            disabled={numPlayerCoins > 10}
          />
        </Modal.Actions>
      </Modal>
    );
  }
}