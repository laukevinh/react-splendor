import React from 'react';
import ReactDOM from 'react-dom';
import { Button, Grid, Icon, Modal } from 'semantic-ui-react'

export default class Bank extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      coins: {
        'white': props.maxCoins,
        'blue': props.maxCoins,
        'green': props.maxCoins,
        'red': props.maxCoins,
        'black': props.maxCoins,
        'wild': 5,
      }
    };
  }

  updateBankBal = (coins) => {
    this.setState({
      coins: coins,
    });
  }
  
  render() {
    const coins = Object.entries(this.state.coins).map(([color, count], idx) => {
      return (
        <Button color={color}>{count}</Button>
      );
    });
    return (
      <Grid.Column>
        <Button.Group vertical>
          {coins}
        </Button.Group>
        <Grid.Row>
          <ModalPickCoins 
            coins={this.state.coins}
            updateBankBal={this.updateBankBal}
          />        
        </Grid.Row>
      </Grid.Column>
    );
  }
}

class ModalPickCoins extends React.Component {
  constructor(props) {
    super(props);
    const emtpyWalletArray = Object.keys(props.coins).map(key => [key, 0]);
    this.state = {
      open: false,
      bankCoins: props.coins,
      tempCoins: Object.fromEntries(emtpyWalletArray),
      updateBankBal: props.updateBankBal,
    };
  }
  
  setOpen(open) {
    this.setState({
      open: open
    });
  }

  handleCoinTake(color) {
    let bankCoins = Object.assign({}, this.state.bankCoins);
    let tempCoins = Object.assign({}, this.state.tempCoins);
    bankCoins[color]--;
    tempCoins[color]++;
    this.setState({
      bankCoins: bankCoins,
      tempCoins: tempCoins,
    });
  }

  handleCoinReturn(color) {
    let bankCoins = Object.assign({}, this.state.bankCoins);
    let tempCoins = Object.assign({}, this.state.tempCoins);
    bankCoins[color]++;
    tempCoins[color]--;
    this.setState({
      bankCoins: bankCoins,
      tempCoins: tempCoins,
    });
  }

  handleConfirm(coins) {
    this.state.updateBankBal(coins);
    this.setOpen(false);
  }

  render() {
    const open = this.state.open;
    const coins = Object.entries(this.state.bankCoins).map(([color, count], idx) => {
      let bankCoinButton = (
        <Button
          color={color}
          content={count}
          onClick={() => this.handleCoinTake(color)}
          disabled={this.state.bankCoins[color] === 0}
        />
      );
      
      let tempCoinButton = (
        <Button
          color={color}
          content={this.state.tempCoins[color]}
          onClick={() => this.handleCoinReturn(color)}
        />
      );
      
      return (
        <li key={idx}>
          {bankCoinButton}
          {this.state.tempCoins[color] > 0 && tempCoinButton}
        </li>
      );
    });

    return (
      <Modal
        onClose={() => this.setOpen(false)}
        onOpen={() => this.setOpen(true)}
        open={open}
        trigger={<Button>Collect Coins</Button>}
      >
        <Modal.Header>Select Coins</Modal.Header>
        <Modal.Content>{coins}</Modal.Content>
        <Modal.Actions>
          <Button color='black' onClick={() => this.setOpen(false)}>
            Cancel
          </Button>
          <Button
            content="confirm"
            onClick={() => this.handleConfirm(this.state.bankCoins)}
            positive
          />
        </Modal.Actions>
      </Modal>
    );
  }
}