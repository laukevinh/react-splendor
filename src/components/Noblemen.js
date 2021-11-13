import React from 'react';
import { Card, Grid, Modal } from 'semantic-ui-react';
import renderPrice from '../utils'

function Noble(props) {
  const content = (
    <Card.Content>
      <Card.Header textAlign='right' as='h1'>
        {props.points}
      </Card.Header>
      {renderPrice(props.price, "game-card")}
    </Card.Content>
  );
  return props.handleNoblemenSelection ? (
    <Card onClick={() => props.handleNoblemenSelection(props.idx)}>
      {content}
    </Card>
  ) : (
    <Card>
      {content}
    </Card>
  );
}

export default function Noblemen(props) {
  const { noblemen } = props;
  const nobles = noblemen.map(noble => {
    return (
      <Grid.Column>
        {
          noble.isDisplayed &&
          <Noble
            points={noble.points}
            price={noble.price}
          />
        }
      </Grid.Column>
    );
  });

  return (
    <Grid columns={nobles.length}>
      {nobles}
    </Grid>
  );
}

export function ModalNoblemen(props) {
  const { noblemen, selectableNoblemen, handleNoblemenSelection, open } = props;
  const nobles = noblemen.map((noble, idx) => {
    return (
      <Grid.Column>
        {
          selectableNoblemen[idx] &&
          <Noble
            idx={idx}
            points={noble.points}
            price={noble.price}
            handleNoblemenSelection={handleNoblemenSelection}
          />
        }
      </Grid.Column>
    );
  });

  return (
    <Modal open={open}>
      <Modal.Header>Select Noble</Modal.Header>
      <Modal.Content>
        <Grid columns={noblemen.length}>
          {nobles}
        </Grid>
      </Modal.Content>
    </Modal>
  );
}