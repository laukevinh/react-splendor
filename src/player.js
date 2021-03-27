import React from 'react';
import { Button, Grid, Card, Modal } from 'semantic-ui-react'

export default class Player extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const coins = Object.entries(this.props.coins).map(([color, count], idx) => {
      return (
        <Grid.Column>
          <div className={"coin " + color}>
            {count}
          </div>
        </Grid.Column>
      );
    });
    const cards = Object.entries(this.props.cards).map(([color, cardArray]) => {
      return (
        <Grid.Column>
          <Card className="mini">
            <Card.Content className={color}>
              {cardArray.length}
            </Card.Content>
          </Card>
        </Grid.Column>
      );
    });
    const activePlayer = this.props.activePlayer && !this.props.finished ? "active-player" : null;
    return (
      <Grid className={activePlayer}>
        <Grid.Row columns={2}>
          <Grid.Column>{this.props.points}</Grid.Column>
          <Grid.Column textAlign="right">{this.props.playerName}</Grid.Column>
        </Grid.Row>
        <Grid.Row columns={6}>
          {coins}
        </Grid.Row>
        <Grid.Row columns={6}>
          {cards}
          <Grid.Column>
            <ModalPlayerDetails {...this.props} />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}

class ModalPlayerDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
    };
  }

  render() {
    const open = this.state.open;
    const { playerName } = this.props;
    const cards = Object.entries(this.props.cards).map(([color, cardArray]) => {
      return (
        <Grid.Column>
          <Card className="mini">
            <Card.Content className={color}>
              {cardArray.length}
            </Card.Content>
          </Card>
        </Grid.Column>
      );
    });
    const reserved = Object.values(this.props.reserved).map(card => {
      const [color, points, prices] = [card.color, card.points, card.prices];
      return (
        <Grid.Row>
          <Card className="mini">
            <Card.Content className={color}>
              <Card.Header>
                <Grid>
                  <Grid.Row columns={2}>
                    <Grid.Column>{color}</Grid.Column>
                    <Grid.Column textAlign="right">{points}</Grid.Column>
                  </Grid.Row>
                </Grid>
              </Card.Header>
              <Card.Description>
                {prices}
              </Card.Description>
            </Card.Content>
          </Card>
        </Grid.Row>
      )
    });
    console.log("Modal", playerName, cards, reserved);

    return (
      <Modal
        onClose={() => this.setState({open: false})}
        onOpen={() => this.setState({open: true})}
        open={open}
        trigger={<Card className="mini">...</Card>}
      >
        <Modal.Header>
          <Grid columns={2}>
            <Grid.Column>{this.props.points}</Grid.Column>
            <Grid.Column textAlign="right">{playerName}</Grid.Column>
          </Grid>
        </Modal.Header>
        <Modal.Content>
          <Grid columns={6}>
            {cards}
            <Grid.Column>
              {reserved}
            </Grid.Column>
          </Grid>
        </Modal.Content>
        <Modal.Actions>
          <Button 
            color='black'
            content="Cancel"
            onClick={() => this.setState({open: false})}
          />
        </Modal.Actions>
      </Modal>
    );
  }

}