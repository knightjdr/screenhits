import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import ActionMenu from './action-menu';
import Queue from '../actions/queue';

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
    Queue.get(this.props.user)
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
        hideActionList={ this.hideActionList }
        queue={ this.state.queue }
        queueMenuAction={ this.queueMenuAction }
        showList={ this.state.showList }
        showActionList={ this.showActionList }
      />
    );
  }
}

ActionMenuContainer.defaultProps = {
  user: PropTypes.shape({
    email: null,
    user: null,
    name: null,
    token: null,
  }),
};

ActionMenuContainer.propTypes = {
  user: PropTypes.shape({
    email: PropTypes.string,
    user: PropTypes.string,
    name: PropTypes.string,
    token: PropTypes.string,
  }),
};

const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};

const Details = connect(
  mapStateToProps,
)(ActionMenuContainer);

export default Details;
