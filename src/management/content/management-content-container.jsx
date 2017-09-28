import deepEqual from 'deep-equal';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import ManagementContent from './management-content';
import { resetPost } from '../../state/post/actions';
import { resetPut } from '../../state/put/actions';

const resetBooleans = {
  create: false,
  edit: false,
  manage: false,
  protocol: false,
};

class ManagementContentContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      menuBooleans: Object.assign({}, resetBooleans),
      item: {},
    };
  }
  componentWillReceiveProps(nextProps) {
    const { activeLevel, available, selected } = nextProps;
    // when changing levels, go to default view
    if (activeLevel !== this.props.activeLevel) {
      this.cancelMenuAction();
    }
    this.setState((prevState) => {
      const newState = {};
      // update item if needed
      const index = available[activeLevel].items.findIndex((obj) => {
        return obj._id === selected;
      });
      if (
        index > -1 &&
        !deepEqual(prevState.item, available[activeLevel].items[index])
      ) {
        newState.item = JSON.parse(JSON.stringify(available[activeLevel].items[index]));
      }
      // if switching between items and currently on "creation" page, reset to default view
      if (
        selected &&
        selected !== this.props.selected
      ) {
        if (prevState.menuBooleans.create) {
          this.cancelMenuAction();
        }
      }
      return newState;
    });
  }
  cancelMenuAction = () => {
    this.setState({ menuBooleans: resetBooleans });
  }
  createMenuAction = () => {
    this.props.resetPost();
    this.setState({
      menuBooleans: {
        create: true,
        edit: false,
        manage: false,
        protocol: false,
      },
    });
  }
  editMenuAction = () => {
    this.props.resetPut(this.state.item._id);
    this.setState({
      menuBooleans: {
        create: false,
        edit: true,
        manage: false,
        protocol: false,
      },
    });
  }
  manageMenuAction = () => {
    this.setState({
      menuBooleans: {
        create: false,
        edit: false,
        manage: true,
        protocol: false,
      },
    });
  }
  protocolMenuAction = () => {
    this.setState({
      menuBooleans: {
        create: false,
        edit: false,
        manage: false,
        protocol: true,
      },
    });
  }
  top = () => {
    return this.element ? this.element.getBoundingClientRect().top : 105;
  }
  render() {
    return (
      <div
        ref={ (element) => { this.element = element; } }
        style={ {
          width: '100%',
        } }
      >
        <ManagementContent
          activeLevel={ this.props.activeLevel }
          availableLength={ this.props.available[this.props.activeLevel].items.length }
          cancelMenuAction={ this.cancelMenuAction }
          menuBoolean={ this.state.menuBooleans }
          item={ this.state.item }
          menuActions={ {
            create: this.createMenuAction,
            edit: this.editMenuAction,
            manage: this.manageMenuAction,
            protocol: this.protocolMenuAction,
          } }
          selected={ this.props.selected }
          top={ this.top }
        />
      </div>
    );
  }
}

ManagementContentContainer.defaultProps = {
  selected: null,
};

ManagementContentContainer.propTypes = {
  activeLevel: PropTypes.string.isRequired,
  available: PropTypes.shape({
    experiment: PropTypes.shape({
      didInvalidate: PropTypes.bool,
      isFetching: PropTypes.bool,
      items: PropTypes.arrayOf(PropTypes.shape({
      })),
      message: PropTypes.string,
    }),
    project: PropTypes.shape({
      didInvalidate: PropTypes.bool,
      isFetching: PropTypes.bool,
      items: PropTypes.arrayOf(PropTypes.shape({
      })),
      message: PropTypes.string,
    }),
    sample: PropTypes.shape({
      didInvalidate: PropTypes.bool,
      isFetching: PropTypes.bool,
      items: PropTypes.arrayOf(PropTypes.shape({
      })),
      message: PropTypes.string,
    }),
    screen: PropTypes.shape({
      didInvalidate: PropTypes.bool,
      isFetching: PropTypes.bool,
      items: PropTypes.arrayOf(PropTypes.shape({
      })),
      message: PropTypes.string,
    }),
  }).isRequired,
  resetPost: PropTypes.func.isRequired,
  resetPut: PropTypes.func.isRequired,
  selected: PropTypes.number,
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    resetPost: () => {
      dispatch(resetPost(ownProps.activeLevel));
    },
    resetPut: (_id) => {
      dispatch(resetPut(_id, ownProps.activeLevel));
    },
  };
};

const mapStateToProps = (state) => {
  return {
    available: state.available,
  };
};

const Details = connect(
  mapStateToProps,
  mapDispatchToProps,
)(ManagementContentContainer);

export default Details;
