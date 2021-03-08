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
      <ModalExampleModal 
        coins={this.state.coins}
        updateBankBal={this.updateBankBal}
      />
    );
  }
}

const emptyWallet = {
  'white': 0,
  'blue': 0,
  'green': 0,
  'red': 0,
  'black': 0,
  'wild': 0,
}

function ModalExampleModal(props) {
  const [playerCoins, setPlayerCoins] = React.useState(emptyWallet);
  const [bankCoins, setBankCoins] = React.useState(Object.assign({}, props.coins));
  const [open, setOpen] = React.useState(false)

  const handleClick = (color, count) => {
    alert("handleClickModal")
  }

  const takeCoinClick = (color) => {
    let copyBankCoins = Object.assign({}, bankCoins);
    copyBankCoins[color]--;
    setBankCoins(copyBankCoins);
    let copyPlayerCoins = Object.assign({}, playerCoins);
    copyPlayerCoins[color]++;
    setPlayerCoins(copyPlayerCoins);
  }

  const returnCoinClick = (color) => {
    let copyBankCoins = Object.assign({}, bankCoins);
    copyBankCoins[color]++;
    setBankCoins(copyBankCoins);
    let copyPlayerCoins = Object.assign({}, playerCoins);
    copyPlayerCoins[color]--;
    setPlayerCoins(copyPlayerCoins);
  }

  // const coins = Object.entries(bankCoins).map(([color, count], idx) => {
  //   playerCoins[color] = 0;
  //   return (
  //     <li key={idx}>
  //       <Button
  //         content={color}
  //         color={color}
  //         label={count}
  //         labelPosition='right'
  //       />
  //       <Button
  //         content="+"
  //         onClick={() => takeCoinClick(color, bankCoins, playerCoins)}
  //       />
  //       <Button
  //         content="-"
  //         onClick={() => returnCoinClick(color, bankCoins, playerCoins)}
  //       />
  //       <span>{playerCoins[color]}</span>
  //     </li>
  //   );
  // })

  return (
    <Modal
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      trigger={<Button>Show Modal</Button>}
    >
      <Modal.Content>
        {
          Object.entries(bankCoins).map(([color, count], idx) => {
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
                  onClick={() => takeCoinClick(color)}
                />
                <Button
                  content="-"
                  onClick={() => returnCoinClick(color)}
                />
                <span>{playerCoins[color]}</span>
              </li>
            );
          })
        }
      </Modal.Content>
      <Modal.Actions>
        <Button color='black' onClick={() => setOpen(false)}>
          Cancel
        </Button>
        <Button
          content="confirm"
          onClick={() => setOpen(false)}
          positive
        />
      </Modal.Actions>
    </Modal>
  )
}