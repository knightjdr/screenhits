import deepEqual from 'deep-equal';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import ManagementContent from './management-content';
import { getData } from '../../state/get/data-actions';
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
        return obj._id === selected[activeLevel];
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
        selected[activeLevel] &&
        selected[activeLevel] !== this.props.selected[activeLevel]
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
  updateMenuAction = () => {
    let filters = {};
    switch (this.props.activeLevel) {
      case 'experiment':
        filters = {
          project: this.props.selected.project,
          screen: this.props.selected.screen,
        };
        break;
      case 'project':
        filters = {};
        break;
      case 'sample':
        filters = {
          experiment: this.props.selected.experiment,
          project: this.props.selected.project,
          screen: this.props.selected.screen,
        };
        break;
      case 'screen':
        filters = {
          project: this.props.selected.project,
        };
        break;
      default:
        filters = {};
        break;
    }
    this.props.getData(filters);
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
            update: this.updateMenuAction,
          } }
          selected={ this.props.selected[this.props.activeLevel] }
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
  getData: PropTypes.func.isRequired,
  resetPost: PropTypes.func.isRequired,
  resetPut: PropTypes.func.isRequired,
  selected: PropTypes.shape({
    experiment: PropTypes.number,
    project: PropTypes.number,
    sample: PropTypes.number,
    screen: PropTypes.number,
  }),
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    getData: (filters) => {
      dispatch(getData(ownProps.activeLevel, filters));
    },
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
