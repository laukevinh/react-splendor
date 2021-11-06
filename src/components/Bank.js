import React from 'react';
import Wallet from './Wallet';
import { Coin, WILD } from '../utils';
import { Button, Grid, Modal } from 'semantic-ui-react'

export default class Bank extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const coins = Object.entries(this.props.coins).map(([color, count], idx) => {
      return (
        <Grid.Row>
          <Coin color={color} content={count} />
        </Grid.Row>
      );
    });
    return (
      <Grid.Column>
        {coins}
        <Grid.Row>
          <ModalPickCoins
            coins={this.props.coins}
            handleCollectCoins={this.props.handleCollectCoins}
            finished={this.props.finished}
          />
        </Grid.Row>
      </Grid.Column>
    );
  }
}

class ModalPickCoins extends React.Component {
  constructor(props) {
    super(props);
    this.handleCoinTake = this.handleCoinTake.bind(this);
    this.handleCoinReturn = this.handleCoinReturn.bind(this);
    this.state = {
      open: false,
      bankCoins: props.coins,
      tempCoins: new Wallet(),
      bankCoinsSelectable: this.initBankCoinsSelectable(props.coins),
      numTempCoins: 0,
      handleCollectCoins: props.handleCollectCoins,
    };
  }

  initBankCoinsSelectable(coins) {
    let bankCoinsSelectable = {};
    for (let [color, count] of Object.entries(coins)) {
      if (color !== WILD) {
        bankCoinsSelectable[color] = 0 < count;
      }
    }
    return bankCoinsSelectable;
  }

  onOpenModal() {
    if (!this.props.finished) {
      this.setState({
        open: true,
        bankCoins: this.props.coins,
        numTempCoins: 0,
        bankCoinsSelectable: this.initBankCoinsSelectable(this.props.coins),
      });
    }
  }

  setAllObjValues(obj, value) {
    for (let key of Object.keys(obj)) {
      obj[key] = value;
    }
  }

  handleCoinTake(colorToTake) {
    let bankCoins = Object.assign({}, this.state.bankCoins);
    let tempCoins = Object.assign({}, this.state.tempCoins);
    let numTempCoins = this.state.numTempCoins;
    let bankCoinsSelectable = Object.assign({}, this.state.bankCoinsSelectable);
    bankCoins[colorToTake]--;
    tempCoins[colorToTake]++;
    numTempCoins++;
    if (numTempCoins === 0) {
      alert("Why was it negative");
    } else if (numTempCoins === 1) {
      if (bankCoins[colorToTake] < 3) {
        bankCoinsSelectable[colorToTake] = false;
      } else {
        bankCoinsSelectable[colorToTake] = 0 < bankCoins[colorToTake];
      }
    } else if (numTempCoins === 2) {
      if (1 < tempCoins[colorToTake]) {
        this.setAllObjValues(bankCoinsSelectable, false);
      } else {
        for (let tempCoinColor of Object.keys(tempCoins)) {
          if (0 < tempCoins[tempCoinColor]) {
            bankCoinsSelectable[tempCoinColor] = false;
          }
        }
        bankCoinsSelectable[colorToTake] = false;
      }
    } else if (2 < numTempCoins) {
      this.setAllObjValues(bankCoinsSelectable, false);
    }
    this.setState({
      bankCoins: bankCoins,
      tempCoins: tempCoins,
      numTempCoins: numTempCoins,
      bankCoinsSelectable: bankCoinsSelectable,
    });
  }

  handleCoinReturn(colorToReturn) {
    let bankCoins = Object.assign({}, this.state.bankCoins);
    let tempCoins = Object.assign({}, this.state.tempCoins);
    let numTempCoins = this.state.numTempCoins;
    let bankCoinsSelectable = Object.assign({}, this.state.bankCoinsSelectable);
    bankCoins[colorToReturn]++;
    tempCoins[colorToReturn]--;
    numTempCoins--;
    if (numTempCoins < 2) {
      this.setAllObjValues(bankCoinsSelectable, true);
    } else if (numTempCoins === 2) {
      for (let color of Object.keys(bankCoinsSelectable)) {
        bankCoinsSelectable[color] = tempCoins[color] === 0;
      }
    }
    this.setState({
      bankCoins: bankCoins,
      tempCoins: tempCoins,
      numTempCoins: numTempCoins,
      bankCoinsSelectable: bankCoinsSelectable,
    });
  }

  handleConfirm(coins) {
    this.setState({ tempCoins: new Wallet(), open: false });  // reset temp coins
    this.state.handleCollectCoins(coins);
  }

  handleCancel() {
    let bankCoins = Object.assign({}, this.state.bankCoins);
    let tempCoins = Object.assign({}, this.state.tempCoins);
    for (let color of Object.keys(tempCoins)) {
      bankCoins[color] += tempCoins[color];
      tempCoins[color] = 0;
    }
    this.setState({
      bankCoins: bankCoins,
      tempCoins: tempCoins,
      numTempCoins: 0,
      open: false,
    });
  }

  render() {
    const open = this.state.open;
    const coins = Object.entries(this.state.bankCoins).map(([color, count], idx) => {
      const disabled = !this.state.bankCoinsSelectable[color];
      const bankCoinButton = <Coin color={color} content={count} disabled={disabled} onClick={this.handleCoinTake} />;
      const tempCoinButton = <Coin color={color} content={this.state.tempCoins[color]} onClick={this.handleCoinReturn} />;
      return color !== WILD ? (
        <Grid.Row>
          {bankCoinButton}
          {this.state.tempCoins[color] > 0 && tempCoinButton}
        </Grid.Row>
      ) : (
        <></>
      );
    });

    return (
      <Modal
        className="bank"
        onClose={() => this.handleCancel()}
        onOpen={() => this.onOpenModal()}
        open={open}
        trigger={<Button>Collect Coins</Button>}
      >
        <Modal.Header>Select Coins</Modal.Header>
        <Modal.Content>{coins}</Modal.Content>
        <Modal.Actions>
          <Button
            color='black'
            content="Cancel"
            onClick={() => this.handleCancel()}
          />
          <Button
            content="confirm"
            onClick={() => this.handleConfirm(this.state.tempCoins)}
            positive
            disabled={this.state.numTempCoins === 0}
          />
        </Modal.Actions>
      </Modal>
    );
  }
}