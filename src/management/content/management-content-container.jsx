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
    const { active, available, selected } = nextProps;
    const index = available[active].items.findIndex((obj) => { return obj._id === selected; });
    const item = index > -1 ? available[active].items[index] : {};
    if (Object.keys(item).length > 0) {
      this.setState({ item });
    }
    if (selected && selected !== this.props.selected) {
      if (this.state.createBoolean) {
        this.setState({ createBoolean: false });
      }
    }
  }
  cancel = () => {
    this.setState({
      createBoolean: false,
      editBoolean: false,
      manageBoolean: false,
    });
  }
  create = () => {
    this.props.resetPost();
    this.setState({
      createBoolean: true,
      editBoolean: false,
      manageBoolean: false,
    });
  }
  edit = () => {
    this.props.resetPut(this.state.item._id);
    this.setState({
      createBoolean: false,
      editBoolean: true,
      manageBoolean: false,
    });
  }
  manage = () => {
    this.setState({
      createBoolean: false,
      editBoolean: false,
      manageBoolean: true,
    });
  }
  top = () => {
    return this.element ? this.element.getBoundingClientRect().top : 100;
  }
  render() {
    return (
      <ManagementContent
        active={ this.props.active }
        availableLength={ this.props.available[this.props.active].items.length }
        cancel={ this.cancel }
        createBoolean={ this.state.createBoolean }
        editBoolean={ this.state.editBoolean }
        funcs={ { create: this.create, edit: this.edit, manage: this.manage } }
        item={ this.state.item }
        manageBoolean={ this.state.manageBoolean }
        ref={ (element) => { this.element = element; } }
        selected={ this.props.selected }
        top={ this.top }
      />
    );
  }
}

ManagementContentContainer.defaultProps = {
  selected: null,
};

ManagementContentContainer.propTypes = {
  active: PropTypes.string.isRequired,
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
      dispatch(resetPost(ownProps.active));
    },
    resetPut: (_id) => {
      dispatch(resetPut(_id, ownProps.active));
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
