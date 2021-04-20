import React from 'react';
import './index.css';
import 'semantic-ui-css/semantic.min.css';
import { Grid, Card, Modal, Button } from 'semantic-ui-react';
import renderPrice, { calculateCharge, RESERVED } from './utils'

export default class CardModal extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        open: false,
      };
    }
    
    setOpen(open) {
      if (!this.props.finished) {
        this.setState({open: open});
      }
    }
    
    handleReserve(source, level, column, card) {
      this.setState({open: false});
      this.props.handleReserve(source, level, column, card); //assume props is okay, don't need to use state
    }
    
    handleConfirm(source, level, column, index, card) {
      this.setState({open: false});
      this.props.handleBuy(source, level, column, index, card); //assume props is okay, don't need to use state
    }
    
    render() {
      const { source, level, column, index, card, playerWallet, playerCards } = this.props;
      if (card === null || card === undefined) {
        return <></>;
      }
      const { color, points, price } = card;
      const prices = renderPrice(price, "coin");
      const cardComponent = (
        <Card>
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
      );
      // TODO: BUG: you can buy another player's reserved card.
      const insufficientFunds = calculateCharge(price, playerWallet, playerCards).insufficientFunds;
      return (
        <Modal
          onClose={() => this.setOpen(false)}
          onOpen={() => this.setOpen(true)}
          open={this.state.open}
          trigger={cardComponent}
        >
          <Modal.Header>
            <Grid>
              <Grid.Row columns={2}>
                <Grid.Column>{color}</Grid.Column>
                <Grid.Column textAlign="right">{points}</Grid.Column>
              </Grid.Row>
            </Grid>
          </Modal.Header>
          <Modal.Content>{prices}</Modal.Content>
          <Modal.Actions>
            <Button 
              color='black'
              content="Cancel"
              onClick={() => this.setOpen(false)}
            />
            <Button
              color='yellow'
              content="Reserve"
              disabled={source === RESERVED}
              onClick={() => this.handleReserve(source, level, column, card)}
            />
            <Button
              content="Buy"
              disabled={insufficientFunds}
              onClick={() => this.handleConfirm(source, level, column, index, card)}
              positive
            />
          </Modal.Actions>
        </Modal>
      );
    }
  }