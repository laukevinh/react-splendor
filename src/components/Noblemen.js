import React from 'react';
import { Card, Grid, Modal } from 'semantic-ui-react';
import renderPrice, { pricetag } from '../utils'

function Noble(props) {
  const {
    idx,
    points,
    price,
    onClick
  } = props;
  const content = (
    <Card.Content>
      <Card.Header textAlign='right' as='h1'>
        {points}
      </Card.Header>
      {renderPrice(price, "game-card")}
    </Card.Content>
  );
  return onClick ? (
    <Card onClick={() => onClick(idx)}>
      {content}
    </Card>
  ) : (
    <Card>
      {content}
    </Card>
  );
}

export default function Noblemen(props) {
  const {
    noblemen,
    includesList,
    onClick
  } = props;
  const nobles = noblemen.map((noble, idx) => {
    return (
      <Grid.Column key={pricetag(noble)}>
        {
          includesList[idx] &&
          <Noble
            idx={idx}
            points={noble.points}
            price={noble.price}
            onClick={onClick}
          />
        }
      </Grid.Column>
    );
  });

  return (
    <Grid
      columns={nobles.length}
      className={'min-height'}
    >
      {nobles}
    </Grid>
  );
}

export function ModalNoblemen(props) {
  const { noblemen, includesList, onClick, open } = props;

  return (
    <Modal open={open}>
      <Modal.Header>Select Noble</Modal.Header>
      <Modal.Content>
        <Noblemen
          noblemen={noblemen}
          includesList={includesList}
          onClick={onClick}
        />
      </Modal.Content>
    </Modal>
  );
}