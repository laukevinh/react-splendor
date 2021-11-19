import React from 'react';
import { CoinWallet } from '../objects/Wallet';
import { WILD } from '../utils';
import { Button, Container, Grid, Modal } from 'semantic-ui-react'
import Coin from './Coin';
import { COLORS_NO_WILD } from '../constants/colors';
import BankBase from '../objects/BankBase';

export default function Bank(props) {
  const {
    bank,
    handleCoinTransaction,
    disabled
  } = props;

  const coins = Object.entries(bank.wallet).map(([color, count], idx) => {
    return (
      <Coin
        key={color}
        color={color}
      >
        {count}
      </Coin>
    );
  });

  return (
    <Container>
      {coins}
      <ModalPickCoins
        bank={bank}
        coins={props.coins}
        handleCoinTransaction={handleCoinTransaction}
        disabled={disabled}
      />
    </Container>
  );
}

class ModalPickCoins extends React.Component {
  constructor(props) {
    super(props);
    this.handleCoinTake = this.handleCoinTake.bind(this);
    this.handleCoinReturn = this.handleCoinReturn.bind(this);
    this.state = {
      open: false,
      bank: props.bank,
      bankCoins: props.coins,
      tempCoins: new CoinWallet(),
      bankCoinsSelectable: this.initBankCoinsSelectable(props.coins),
    };
  }

  componentDidUpdate(prevProps, prevState) {
    if (!prevState.open && this.state.open) {
      this.setState({
        bank: this.props.bank,
        tempCoins: new CoinWallet(),
        bankCoinsSelectable: this.initBankCoinsSelectable(this.props.coins)
      });
    }
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

  handleCoinTake(colorToTake) {
    const {
      bank,
      tempCoins,
      bankCoinsSelectable
    } = this.state;

    let newBank = Object.assign(new BankBase(), bank);
    let newBankWallet = Object.assign(new CoinWallet(), bank.wallet);
    let newTempCoins = Object.assign(new CoinWallet(), tempCoins);
    let newBankCoinsSelectable = Object.assign({}, bankCoinsSelectable);

    if (bank.wallet[colorToTake] === 0) {
      console.log("Cannot take any more coins of this color", bank.wallet);
      return;
    }
    if (bankCoinsSelectable[colorToTake] === false) {
      console.log("Cannot take coins because bankCoinsSelectable for this color is false", bankCoinsSelectable);
      return;
    }

    newBankWallet[colorToTake]--;
    newTempCoins[colorToTake]++;

    let sum = newTempCoins.sum();

    if (sum === 1) {
      newBankCoinsSelectable[colorToTake] = newBankWallet[colorToTake] > 2;
    } else if (sum === 2) {
      if (newTempCoins[colorToTake] === 2) {
        COLORS_NO_WILD.forEach(color => {
          newBankCoinsSelectable[color] = false;
        });
      } else {
        COLORS_NO_WILD.forEach(color => {
          newBankCoinsSelectable[color] = newBankWallet[color] > 0 && newTempCoins[color] === 0;
        });
      }
    } else {
      COLORS_NO_WILD.forEach(color => {
        newBankCoinsSelectable[color] = false;
      })
    }

    newBank.wallet = newBankWallet;
    this.setState({
      bank: newBank,
      tempCoins: newTempCoins,
      bankCoinsSelectable: newBankCoinsSelectable,
    });
  }

  handleCoinReturn(colorToReturn) {
    const {
      bank,
      tempCoins,
      bankCoinsSelectable
    } = this.state;

    let newBank = Object.assign(new BankBase(), bank);
    let newBankWallet = Object.assign(new CoinWallet(), bank.wallet);
    let newTempCoins = Object.assign(new CoinWallet(), tempCoins);
    let newBankCoinsSelectable = Object.assign({}, bankCoinsSelectable);

    if (newTempCoins[colorToReturn] === 0) {
      console.log("Cannot return any more coins of this color", bank.wallet);
      return;
    }

    newBankWallet[colorToReturn]++;
    newTempCoins[colorToReturn]--;

    let sum = newTempCoins.sum();

    if (sum === 0) {
      newBankCoinsSelectable[colorToReturn] = newBankWallet[colorToReturn] > 0;
    } else if (sum === 1) {
      COLORS_NO_WILD.forEach(color => {
        if (newTempCoins[color] > 0) {
          newBankCoinsSelectable[color] = newBankWallet[color] > 2;
        } else {
          newBankCoinsSelectable[color] = newBankWallet[color] > 0;
        }
      })
    } else if (sum === 2) {
      COLORS_NO_WILD.forEach(color => {
        newBankCoinsSelectable[color] = newBankWallet[color] > 0 && newTempCoins[color] === 0;
      });
    }

    newBank.wallet = newBankWallet;
    this.setState({
      bank: newBank,
      tempCoins: newTempCoins,
      bankCoinsSelectable: newBankCoinsSelectable,
    });
  }

  handleConfirm(coins) {
    this.props.handleCoinTransaction(coins, true);
    this.setState({
      open: false
    });
  }

  handleCancel() {
    this.setState({
      open: false,
    });
  }

  render() {
    const {
      open,
      bank,
      tempCoins,
      bankCoinsSelectable
    } = this.state;

    const coins = COLORS_NO_WILD.map(color => {
      const bankQty = bank.wallet[color];
      const tempQty = tempCoins[color];
      const bankCoinButton = (
        <Coin
          color={color}
          disabled={bankQty === 0 || !bankCoinsSelectable[color]}
          onClick={this.handleCoinTake}
        >
          {bankQty}
        </Coin>
      );
      const tempCoinButton = (
        <Coin
          color={color}
          onClick={this.handleCoinReturn}
        >
          {tempQty}
        </Coin>
      );
      return (
        <Grid.Row key={color}>
          {bankCoinButton}
          {tempQty > 0 && tempCoinButton}
        </Grid.Row>
      );
    });

    return (
      <Modal
        className="bank"
        size={'mini'}
        onClose={() => this.setState({ open: false })}
        onOpen={() => this.setState({ open: true })}
        open={open && !this.props.disabled}
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
            onClick={() => this.handleConfirm(tempCoins)}
            positive
            disabled={tempCoins.sum() === 0}
          />
        </Modal.Actions>
      </Modal>
    );
  }
}