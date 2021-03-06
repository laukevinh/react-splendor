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
      },
      isOpen: false
    };
  }

  handleClick = (color, count) => {
    this.state.coins[color]--;
    this.setState((state) => {
      return {coins: this.state.coins}
    });
  }
  
  render() {
    return (
      <ModalExampleModal 
        coins={this.state.coins} 
        handleClick={this.handleClick}
      />
    );
  }
}

function ModalExampleModal(props) {
  const [open, setOpen] = React.useState(false)

  const coins = Object.entries(props.coins).map(([color, count], idx) => {
    return (
      <li key={idx}>
        <Button
          content={color}
          color={color}
          label={count}
          labelPosition='right'
          onClick={() => props.handleClick(color)}
        />
      </li>
    );
  })

  return (
    <Modal
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      trigger={<Button>Show Modal</Button>}
    >
      <Modal.Content>
        {coins}
      </Modal.Content>
      <Modal.Actions>
        <Button color='black' onClick={() => setOpen(false)}>
          Nope
        </Button>
        <Button
          content="Yep, that's me"
          labelPosition='right'
          icon='checkmark'
          onClick={() => setOpen(false)}
          positive
        />
      </Modal.Actions>
    </Modal>
  )
}