import React from 'react';
import './index.css';
import 'semantic-ui-css/semantic.min.css';
import { Grid, Card, Modal, Button } from 'semantic-ui-react';
import renderPrice from './utils'

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
    
    handleReserve(level, column, card) {
      this.setState({open: false});
      this.props.handleReserve(level, column, card); //assume props is okay, don't need to use state
    }
    
    handleConfirm(source, level, column, index, card) {
      this.setState({open: false});
      this.props.handleBuy(source, level, column, index, card); //assume props is okay, don't need to use state
    }
    
    render() {
      const { source, level, column, index, card } = this.props;
      const { color, points, price } = card;
      const prices = renderPrice(price);
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
              onClick={() => this.handleReserve(level, column, card)}
            />
            <Button
              content="Buy"
              onClick={() => this.handleConfirm(source, level, column, index, card)}
              positive
            />
          </Modal.Actions>
        </Modal>
      );
    }
  }