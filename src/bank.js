import React from 'react';
import Wallet from './wallet';
import { Coin } from './utils';
import { Button, Grid, Icon, Modal } from 'semantic-ui-react'

export default class Bank extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const coins = Object.entries(this.props.coins).map(([color, count], idx) => {
      return (
        <Grid.Row>
          <Coin color={color} content={count}/>
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
      tempCoins: Wallet(false),
      handleCollectCoins: props.handleCollectCoins,
    };
  }

  onOpenModal() {
    if (!this.props.finished) {
      this.setState({
        open: true,
        bankCoins: this.props.coins
      });
    }
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
    this.setState({tempCoins: Wallet(false), open: false});  // reset temp coins
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
      open: false,
    });
  }

  render() {
    const open = this.state.open;
    const coins = Object.entries(this.state.bankCoins).map(([color, count], idx) => {
      const disabled = this.state.bankCoins[color] === 0;
      const bankCoinButton = <Coin color={color} content={count} disabled={disabled} onClick={this.handleCoinTake}/>;
      const tempCoinButton = <Coin color={color} content={this.state.tempCoins[color]} onClick={this.handleCoinReturn}/>;
      return (
        <Grid.Row>
          {bankCoinButton}
          {this.state.tempCoins[color] > 0 && tempCoinButton}
        </Grid.Row>
      );
    });

    return (
      <Modal
        className="bank"
        onClose={() => this.setState({open: false})}
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
          />
        </Modal.Actions>
      </Modal>
    );
  }
}