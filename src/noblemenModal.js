import React from 'react';
import { Grid, Modal, Button } from 'semantic-ui-react';
import renderPrice from './utils';

export default class ModalNoblemen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: props.open,
    };
  }
  
  setOpen(open) {
    if (!this.props.finished) {
      this.setState({open: open});
    }
  }

  handleConfirm(nobleIndex) {
    this.setState({open: false});
    this.props.handleNoblemenSelection(nobleIndex);
  }

  handleSelect(index) {
    this.setState({selectedNoble: index});
  }

  render() {
    // noblemen only contains the ones you're qualified to select
    let open = this.props.open;
    const noblemen = this.props.noblemen.map((noble, idx) => {
      return (
        <Grid.Column 
          onClick={() => this.handleConfirm(idx)}
          className="noble"
        >
          <Grid.Row>
            VP: {noble.points}
          </Grid.Row>
          {renderPrice(noble.price)}
        </Grid.Column>
      )
    });
    
    return (
      <Modal
        onClose={() => this.setOpen(false)}
        onOpen={() => this.setOpen(true)}
        open={open}
        trigger={null}
      >
        <Modal.Header>
          Select Noble
        </Modal.Header>
        <Modal.Content>
          <Grid columns={noblemen.length}>
            {noblemen}
          </Grid>
        </Modal.Content>
      </Modal>
    );
  }
}