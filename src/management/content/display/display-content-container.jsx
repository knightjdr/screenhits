import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import React from 'react';

import DisplayContent from './display-content';
import Format from './format-edit';
import { resetPost } from '../../../state/post/actions';
import { resetPut, submitPut } from '../../../state/put/actions';
import ValidateField from '../create/validate-fields';

class DisplayContentContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editMessages: {
        didPutFail: false,
        _id: null,
        isPut: false,
        message: null,
      },
      errors: Format.blankError[this.props.active],
      originalItem: Object.assign({}, this.props.item),
      postMessage: null,
      reset: 0,
      updateItem: Object.assign({}, this.props.item),
      warning: false,
    };
  }
  componentWillReceiveProps(nextProps) {
    const { active, item, putState, postState, selected } = nextProps;
    // update item when store updates
    this.setState({ originalItem: item });
    // check for and update edit messages
    const index = !putState[active] ?
      -1
      :
      putState[active].findIndex(obj => obj._id === selected)
    ;
    const editMessages = index > -1 ?
      Object.assign({}, putState[active][index])
      : {
        didPutFail: false,
        _id: null,
        isPut: false,
        message: null,
      }
    ;
    const success = this.state.editMessages.isPut &&
      !editMessages.isPut
      && !editMessages.didPutFail
    ;
    if (success) {
      this.props.reset();
    }
    this.setState({ editMessages });
    // check for post messages
    const postMessage = postState[active]._id === selected ?
      postState[active].message
      :
      null
    ;
    this.setState({ postMessage });
  }
  componentWillUpdate() {
    if (this.state.postMessage) {
      this.props.postReset(this.props.active);
    }
  }
  cancel = () => {
    this.props.putReset(this.props.item._id, this.props.active);
    this.props.reset();
  }
  reset = () => {
    this.setState(prevState => ({
      errors: Format.blankError[this.props.active],
      reset: prevState.reset + 1,
      updateItem: prevState.originalItem,
      warning: false,
    }));
  }
  update = () => {
    let error = false;
    const errors = {};
    Object.keys(this.state.updateItem).forEach((field) => {
      if (ValidateField[this.props.active].checkFields.indexOf(field) > -1) {
        const validation = ValidateField[this.props.active][field](this.state.updateItem[field]);
        if (validation.error) {
          error = true;
          errors[field] = validation.message;
        }
      }
    });
    if (error) {
      this.setState({ errors, warning: true });
    } else {
      this.props.update(this.props.item._id, this.props.active, this.state.updateItem);
    }
  }
  updateErrors = (errorObject, warning) => {
    this.setState({ errors: errorObject, warning });
  }
  updateItem = (updateObject) => {
    this.setState({ updateItem: updateObject });
  };
  render() {
    return (
      <DisplayContent
        active={ this.props.active }
        cancel={ this.cancel }
        edit={ this.props.edit }
        editMessages={ this.state.editMessages }
        errors={ this.state.errors }
        item={ this.state.originalItem }
        postMessage={ this.state.postMessage }
        reset={ this.reset }
        resetKey={ this.state.reset }
        update={ this.update }
        updateErrors={ this.updateErrors }
        updateItem={ this.updateItem }
        warning={ this.state.warning }
      />
    );
  }
}

DisplayContentContainer.propTypes = {
  active: PropTypes.string.isRequired,
  edit: PropTypes.bool.isRequired,
  item: PropTypes.shape({
    _id: 1,
    'creator-email': null,
    'creator-name': null,
    description: null,
    lab: null,
    name: null,
    'owner-email': null,
    'owner-name': null,
    permission: null,
    'creation-date': null,
    'update-date': null,
  }).isRequired,
  postReset: PropTypes.func.isRequired,
  putReset: PropTypes.func.isRequired,
  postState: PropTypes.shape({
    experiment: {
      didSubmitFail: false,
      message: null,
      _id: null,
      isSubmitted: false,
    },
    project: {
      didSubmitFail: false,
      message: null,
      _id: null,
      isSubmitted: false,
    },
    sample: {
      didSubmitFail: false,
      message: null,
      _id: null,
      isSubmitted: false,
    },
    screen: {
      didSubmitFail: false,
      message: null,
      _id: null,
      isSubmitted: false,
    },
  }).isRequired,
  putState: PropTypes.shape({
    experiment: {
      _id: null,
      didPutFail: false,
      message: null,
      isPut: null,
    },
    project: {
      _id: null,
      didPutFail: false,
      message: null,
      isPut: null,
    },
    sample: {
      _id: null,
      didPutFail: false,
      message: null,
      isPut: null,
    },
    screen: {
      _id: null,
      didPutFail: false,
      message: null,
      isPut: null,
    },
  }).isRequired,
  reset: PropTypes.func.isRequired,
  selected: PropTypes.number.isRequired,
  update: PropTypes.func.isRequired,
};

const mapDispatchToProps = dispatch => ({
  postReset: (active) => {
    dispatch(resetPost(active));
  },
  putReset: (_id, active) => {
    dispatch(resetPut(_id, active));
  },
  update: (_id, active, obj) => {
    dispatch(submitPut(_id, obj, active));
  },
});

const mapStateToProps = state => ({
  postState: state.post,
  putState: state.put,
});

const Container = connect(
  mapStateToProps,
  mapDispatchToProps,
)(DisplayContentContainer);

export default Container;
