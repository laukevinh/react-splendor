import React from 'react';
import Wallet from './wallet';
import { Button, Grid, Icon, Modal } from 'semantic-ui-react'

export default class Bank extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const coins = Object.entries(this.props.coins).map(([color, count], idx) => {
      return (
        <Grid.Row>
          <div className={"coin " + color}>
            {count}
          </div>
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
          />
        </Grid.Row>
      </Grid.Column>
    );
  }
}

class ModalPickCoins extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      bankCoins: props.coins,
      tempCoins: Wallet(false),
      handleCollectCoins: props.handleCollectCoins,
    };
  }

  setOpen(open) {
    this.setState({open: open});
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
    this.state.handleCollectCoins(coins);
    this.setState({tempCoins: Wallet(false)});  // reset temp coins
    this.setOpen(false);
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
      open: false,
    });
  }

  render() {
    const open = this.state.open;
    const coins = Object.entries(this.state.bankCoins).map(([color, count], idx) => {
      const bankCoinButton = (
        <Button
          color={color}
          content={count}
          onClick={() => this.handleCoinTake(color)}
          disabled={this.state.bankCoins[color] === 0}
        />
      );
      const tempCoinButton = (
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
        onOpen={() => this.setState({ open: true, bankCoins: this.props.coins })}
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
          />
        </Modal.Actions>
      </Modal>
    );
  }
}