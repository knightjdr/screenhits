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
      errors: Format.blankError[this.props.activeLevel],
      inputWidth: window.innerWidth >= 555 ? 500 : window.innerWidth - 55,
      originalItem: Object.assign({}, this.props.item),
      postMessage: this.setPostMessage(
        this.props.postState,
        this.props.activeLevel,
        this.props.selected,
      ),
      reset: 0,
      updateItem: Object.assign({}, this.props.item),
      warning: false,
    };
  }
  componentDidMount() {
    window.addEventListener('resize', this.resize);
  }
  componentWillReceiveProps(nextProps) {
    const { activeLevel, item, putState, postState, selected } = nextProps;
    // update item when store updates
    this.setState({ originalItem: item });
    // check for and update edit messages
    const index = !putState[activeLevel] ?
      -1
      :
      putState[activeLevel].findIndex((obj) => { return obj._id === selected; })
    ;
    const editMessages = index > -1 ?
      Object.assign({}, putState[activeLevel][index])
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
      this.props.cancelMenuAction();
    }
    this.setState({ editMessages });
    // check for post messages
    this.setState({
      postMessage: this.setPostMessage(postState, activeLevel, selected),
    });
  }
  componentWillUpdate() {
    if (this.state.postMessage) {
      this.props.postReset(this.props.activeLevel);
    }
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.resize);
    if (this.state.postMessage) {
      this.props.postReset(this.props.activeLevel);
    }
  }
  setPostMessage = (postState, activeLevel, selected) => {
    return postState[activeLevel]._id === selected ?
      postState[activeLevel].message
      :
      null
    ;
  }
  cancel = () => {
    this.props.putReset(this.props.item._id, this.props.activeLevel);
    this.props.cancelMenuAction();
  }
  reset = () => {
    this.setState((prevState) => {
      return {
        errors: Format.blankError[this.props.activeLevel],
        reset: prevState.reset + 1,
        updateItem: prevState.originalItem,
        warning: false,
      };
    });
  }
  resize = () => {
    this.setState({
      inputWidth: window.innerWidth >= 555 ? 500 : window.innerWidth - 55,
    });
  }
  update = () => {
    let error = false;
    const errors = {};
    Object.keys(this.state.updateItem).forEach((field) => {
      if (ValidateField[this.props.activeLevel].checkFields.indexOf(field) > -1) {
        const validation =
          ValidateField[this.props.activeLevel][field](this.state.updateItem[field]);
        if (validation.error) {
          error = true;
          errors[field] = validation.message;
        }
      }
    });
    if (error) {
      this.setState({ errors, warning: true });
    } else {
      this.props.update(this.props.item._id, this.props.activeLevel, this.state.updateItem);
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
        activeLevel={ this.props.activeLevel }
        cancel={ this.cancel }
        edit={ this.props.edit }
        editMessages={ this.state.editMessages }
        errors={ this.state.errors }
        inputWidth={ this.state.inputWidth }
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
  activeLevel: PropTypes.string.isRequired,
  cancelMenuAction: PropTypes.func.isRequired,
  edit: PropTypes.bool.isRequired,
  item: PropTypes.shape({
    _id: PropTypes.number,
    'creator-email': PropTypes.string,
    'creator-name': PropTypes.string,
    description: PropTypes.string,
    lab: PropTypes.string,
    name: PropTypes.string,
    'owner-email': PropTypes.string,
    'owner-name': PropTypes.string,
    permission: PropTypes.string,
    'creation-date': PropTypes.string,
    'update-date': PropTypes.string,
  }).isRequired,
  postReset: PropTypes.func.isRequired,
  putReset: PropTypes.func.isRequired,
  postState: PropTypes.shape({
    experiment: PropTypes.shape({
      didSubmitFail: PropTypes.bool,
      message: PropTypes.string,
      _id: PropTypes.number,
      isSubmitted: PropTypes.bool,
    }),
    project: PropTypes.shape({
      didSubmitFail: PropTypes.bool,
      message: PropTypes.string,
      _id: PropTypes.number,
      isSubmitted: PropTypes.bool,
    }),
    sample: PropTypes.shape({
      didSubmitFail: PropTypes.bool,
      message: PropTypes.string,
      _id: PropTypes.number,
      isSubmitted: PropTypes.bool,
    }),
    screen: PropTypes.shape({
      didSubmitFail: PropTypes.bool,
      message: PropTypes.string,
      _id: PropTypes.number,
      isSubmitted: PropTypes.bool,
    }),
  }).isRequired,
  putState: PropTypes.shape({
    experiment: PropTypes.arrayOf(
      PropTypes.shape({
        _id: PropTypes.number,
        didPutFail: PropTypes.bool,
        message: PropTypes.string,
        isPut: PropTypes.bool,
      }),
    ),
    project: PropTypes.arrayOf(
      PropTypes.shape({
        _id: PropTypes.number,
        didPutFail: PropTypes.bool,
        message: PropTypes.string,
        isPut: PropTypes.bool,
      }),
    ),
    sample: PropTypes.arrayOf(
      PropTypes.shape({
        _id: PropTypes.number,
        didPutFail: PropTypes.bool,
        message: PropTypes.string,
        isPut: PropTypes.bool,
      }),
    ),
    screen: PropTypes.arrayOf(
      PropTypes.shape({
        _id: PropTypes.number,
        didPutFail: PropTypes.bool,
        message: PropTypes.string,
        isPut: PropTypes.bool,
      }),
    ),
  }).isRequired,
  selected: PropTypes.number.isRequired,
  update: PropTypes.func.isRequired,
};

const mapDispatchToProps = (dispatch) => {
  return {
    postReset: (activeLevel) => {
      dispatch(resetPost(activeLevel));
    },
    putReset: (_id, activeLevel) => {
      dispatch(resetPut(_id, activeLevel));
    },
    update: (_id, activeLevel, obj) => {
      dispatch(submitPut(_id, obj, activeLevel));
    },
  };
};

const mapStateToProps = (state) => {
  return {
    postState: state.post,
    putState: state.put,
  };
};

const Container = connect(
  mapStateToProps,
  mapDispatchToProps,
)(DisplayContentContainer);

export default Container;
