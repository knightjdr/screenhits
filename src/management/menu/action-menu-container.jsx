import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import ActionMenu from './action-menu';
import Queue from '../actions/queue-get';

class ActionMenuContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      anchorEl: null,
      dialog: {
        queue: false,
      },
      queue: {
        retrieving: false,
      },
      radius: 30,
      showList: false,
    };
  }
  dialogClose = () => {
    this.setState({
      dialog: {
        error: null,
        queue: false,
      },
    });
  }
  enlargeMenu = () => {
    this.setState({
      radius: 50,
    });
  }
  hideActionList = () => {
    this.setState({
      showList: false,
    });
  }
  queueMenuAction = () => {
    this.hideActionList();
    this.setState({
      dialog: {
        queue: true,
      },
      queue: {
        details: {},
        error: null,
        retrieving: true,
      },
    });
    Queue.get(this.props.token)
      .then((details) => {
        this.setState({
          queue: {
            details,
            error: null,
            retrieving: false,
          },
        });
      })
      .catch(() => {
        this.setState({
          queue: {
            details: {},
            error: 'The queue could not be retrieved',
            retrieving: false,
          },
        });
      })
    ;
  }
  showActionList = (event) => {
    this.setState({
      anchorEl: event.currentTarget,
      showList: true,
    });
  }
  shrinkMenu = () => {
    this.setState({
      radius: 30,
    });
  }
  render() {
    return (
      <ActionMenu
        anchorEl={ this.state.anchorEl }
        dialog={ Object.assign(
          {},
          this.state.dialog,
          {
            close: this.dialogClose,
          }
        ) }
        enlargeMenu={ this.enlargeMenu }
        hideActionList={ this.hideActionList }
        queue={ this.state.queue }
        queueMenuAction={ this.queueMenuAction }
        radius={ this.state.radius }
        showList={ this.state.showList }
        showActionList={ this.showActionList }
        shrinkMenu={ this.shrinkMenu }
      />
    );
  }
}

ActionMenuContainer.propTypes = {
  token: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => {
  return {
    token: state.token,
  };
};

const Details = connect(
  mapStateToProps,
)(ActionMenuContainer);

export default Details;
