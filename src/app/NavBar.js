import React, { useState } from "react";
import { Button, Container, Dropdown, Grid, Menu, Modal } from "semantic-ui-react";
import { MIN_PLAYERS, MIN_POINTS_TO_WIN } from "../constants/defaults";

export default function NavBar(props) {
  const { pointsToWin, numPlayers, createNewGame, options } = props;

  return (
    <Menu>
      <Container>
        <Menu.Item header>
          <h1>Splendor</h1>
        </Menu.Item>
        <Menu.Item header>
          <h1>Target: {pointsToWin}</h1>
        </Menu.Item>
        <Menu.Item>
          <ModalNewGame
            numPlayers={numPlayers}
            createNewGame={createNewGame}
            options={options}
          />
        </Menu.Item>
      </Container>
    </Menu>
  )
}

function ModalNewGame(props) {
  const { options, numPlayers, pointsToWin, createNewGame } = props;
  const [open, setOpen] = useState(false);
  const [localNumPlayers, setLocalNumPlayers] = useState(numPlayers);
  const [localPointsToWin, setLocalPointsToWin] = useState(pointsToWin);
  const getDropdownOptions = (prefix, listOptions) => {
    return listOptions.map(option => {
      return { key: `${prefix}${option}`, text: `${option}`, value: option }
    })
  }

  const handleConfirm = () => {
    createNewGame(localNumPlayers, localPointsToWin);
    setOpen(false);
  }

  return (
    <Modal
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      trigger={<Button>New Game</Button>}
    >
      <Modal.Header>New Game Settings</Modal.Header>
      <Modal.Content>
        <Grid
          stackable
          columns={2}
        >
          <Grid.Column>
            {'Number of players: '}
            <Dropdown
              defaultValue={MIN_PLAYERS}
              selection
              options={getDropdownOptions('players', options.NUM_OF_PLAYERS)}
              onChange={(e, { value }) => setLocalNumPlayers(value)}
            />
          </Grid.Column>
          <Grid.Column>
            {'Points to Win: '}
            <Dropdown
              defaultValue={MIN_POINTS_TO_WIN}
              selection
              options={getDropdownOptions('points', options.POINTS_TO_WIN)}
              onChange={(e, { value }) => setLocalPointsToWin(value)}
            />
          </Grid.Column>
        </Grid>
      </Modal.Content>
      <Modal.Actions>
        <Button
          color='black'
          content="Cancel"
          onClick={() => setOpen(false)}
        />
        <Button
          color='blue'
          content="Confirm"
          onClick={() => handleConfirm()}
        />
      </Modal.Actions>
    </Modal>
  )
}