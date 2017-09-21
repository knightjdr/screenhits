import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import React from 'react';

import ManagementContent from './management-content';
import { resetPost } from '../../state/post/actions';
import { resetPut } from '../../state/put/actions';

class ManagementContentContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      createBoolean: false,
      editBoolean: false,
      item: {},
      manageBoolean: false,
    };
  }
  componentWillReceiveProps(nextProps) {
    const { activeLevel, available, selected } = nextProps;
    const index = available[activeLevel].items.findIndex((obj) => { return obj._id === selected; });
    const item = index > -1 ? available[activeLevel].items[index] : {};
    if (Object.keys(item).length > 0) {
      this.setState({ item });
    }
    if (selected && selected !== this.props.selected) {
      if (this.state.createBoolean) {
        this.setState({ createBoolean: false });
      }
    }
    if (activeLevel !== this.props.activeLevel) {
      this.cancelMenuAction();
    }
  }
  cancelMenuAction = () => {
    this.setState({
      createBoolean: false,
      editBoolean: false,
      manageBoolean: false,
    });
  }
  createMenuAction = () => {
    this.props.resetPost();
    this.setState({
      createBoolean: true,
      editBoolean: false,
      manageBoolean: false,
    });
  }
  editMenuAction = () => {
    this.props.resetPut(this.state.item._id);
    this.setState({
      createBoolean: false,
      editBoolean: true,
      manageBoolean: false,
    });
  }
  manageMenuAction = () => {
    this.setState({
      createBoolean: false,
      editBoolean: false,
      manageBoolean: true,
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
          createBoolean={ this.state.createBoolean }
          editBoolean={ this.state.editBoolean }
          item={ this.state.item }
          manageBoolean={ this.state.manageBoolean }
          menuActions={ {
            create: this.createMenuAction,
            edit: this.editMenuAction,
            manage: this.manageMenuAction,
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
