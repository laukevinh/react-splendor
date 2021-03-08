import React from 'react';
import ReactDOM from 'react-dom';
import { Button, Image, Modal } from 'semantic-ui-react'

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
    this.setState((state) => {
      return {coins: coins}
    });
  }
  
  render() {
    return (
      <ModalPickCoins 
        coins={this.state.coins}
        updateBankBal={this.updateBankBal}
      />
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
    };
  }
  
  setOpen(open) {
    this.setState({
      open: open
    });
    console.log(this.state);
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

  render() {
    const open = this.state.open;
    const coins = Object.entries(this.state.bankCoins).map(([color, count], idx) => {
      return (
        <li key={idx}>
          <Button
            content={color}
            color={color}
            label={count}
            labelPosition='right'
          />
          <Button
            content="+"
            onClick={() => this.handleCoinTake(color)}
          />
          <Button
            content="-"
            onClick={() => this.handleCoinReturn(color)}
          />
          <span>{this.state.tempCoins[color]}</span>
        </li>
      );
    });

    return (
      <Modal
        onClose={() => this.setOpen(false)}
        onOpen={() => this.setOpen(true)}
        open={open}
        trigger={<Button>Show Modal</Button>}
      >
        <Modal.Content>{coins}</Modal.Content>
        <Modal.Actions>
          <Button color='black' onClick={() => this.setOpen(false)}>
            Cancel
          </Button>
          <Button
            content="confirm"
            onClick={() => this.setOpen(false)}
            positive
          />
        </Modal.Actions>
      </Modal>
    );
  }
}