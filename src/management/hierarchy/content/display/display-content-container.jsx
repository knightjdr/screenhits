import deepEqual from 'deep-equal';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import DefaultProps from '../../../../types/default-props';
import DisplayContent from './display-content';
import Format from './format-edit';
import Permissions from '../../../../helpers/permissions';
import ValidateField from '../../../../modules/validate-field';
import { setIndex } from '../../../../state/set/index-actions';
import { resetDelete, submitDelete } from '../../../../state/delete/actions';
import { resetPost } from '../../../../state/post/actions';
import { resetPut, submitPut } from '../../../../state/put/actions';
import { projectItemProp, selectedProp, userProp } from '../../../../types/index';

class DisplayContentContainer extends React.Component {
  constructor(props) {
    super(props);
    const project = this.getProject(this.props.projects, this.props.selected.project);
    this.state = {
      canEdit: Permissions.canEdit(this.props.user, project),
      errors: Format.blankError[this.props.activeLevel],
      inputWidth: window.innerWidth >= 555 ? 500 : window.innerWidth - 55,
      originalItem: JSON.parse(JSON.stringify(this.props.item)),
      postMessage: this.setPostMessage(
        this.props.postState,
        this.props.activeLevel,
        this.props.viewID,
      ),
      reset: 0,
      updateItem: JSON.parse(JSON.stringify(this.props.item)),
      warning: false,
    };
  }
  componentDidMount = () => {
    window.addEventListener('resize', this.resize);
  }
  componentWillReceiveProps = (nextProps) => {
    const {
      activeLevel,
      deleteState,
      edit,
      item,
      projects,
      putState,
      postState,
      selected,
      user,
      viewID,
    } = nextProps;
    const newState = {};
    // update item when store item updates
    if (!deepEqual(item, this.props.item)) {
      newState.originalItem = JSON.parse(JSON.stringify(item));
      newState.updateItem = JSON.parse(JSON.stringify(item));
    }
    // on project change, check permission
    newState.canEdit = this.updateProject(
      selected.project,
      this.props.selected.project,
      this.state.canEdit,
      projects,
      user
    );
    // on successful delete
    if (
      this.props.deleteState[activeLevel].isDelete &&
      !deleteState[activeLevel].isDelete &&
      !deleteState[activeLevel].didDeleteFail
    ) {
      this.props.changeSelected(activeLevel, null);
    }
    // on successful edit
    if (
      this.props.putState[activeLevel].isPut &&
      !putState[activeLevel].isPut &&
      !putState[activeLevel].didPutFail
    ) {
      this.props.cancelMenuAction();
    }
    // check for post messages
    newState.postMessage = this.setPostMessage(postState, activeLevel, viewID);
    // when switching to edit mode
    if (edit) {
      this.resetMessages();
    }
    // update state
    this.setState(newState);
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.resize);
    this.resetMessages();
  }
  setPostMessage = (postState, activeLevel, viewID) => {
    return postState[activeLevel]._id === viewID ?
    {
      _id: viewID,
      message: postState[activeLevel].message,
    }
    :
    {
      _id: null,
      message: null,
    }
    ;
  }
  getProject = (projects, selectedProject) => {
    if (selectedProject) {
      const projectIndex = projects.findIndex((project) => {
        return project._id === selectedProject;
      });
      return projects[projectIndex];
    }
    return {};
  }
  cancel = () => {
    this.props.cancelMenuAction();
  }
  delete = (_id, type, group) => {
    this.resetMessages();
    this.props.delete(_id, type, group);
  }
  reset = () => {
    this.resetMessages();
    this.setState((prevState) => {
      return {
        errors: Format.blankError[this.props.activeLevel],
        reset: prevState.reset + 1,
        updateItem: prevState.originalItem,
        warning: false,
      };
    });
  }
  resetMessages = () => {
    if (this.props.deleteState[this.props.activeLevel].message) {
      this.props.resetDelete(this.props.activeLevel);
    }
    if (this.props.postState[this.props.activeLevel].message) {
      this.props.resetPost(this.props.activeLevel);
    }
    if (this.props.putState[this.props.activeLevel].message) {
      this.props.resetPut(this.props.activeLevel);
    }
  }
  resize = () => {
    this.setState({
      inputWidth: window.innerWidth >= 555 ? 500 : window.innerWidth - 55,
    });
  }
  update = () => {
    this.resetMessages();
    let error = false;
    const errors = {};
    Object.keys(this.state.updateItem).forEach((field) => {
      if (field === 'other') {
        if (!errors.other) {
          errors.other = {};
        }
        Object.keys(this.state.updateItem[field]).forEach((otherField) => {
          const otherFieldName = `${this.state.updateItem.type}_${otherField}`;
          if (ValidateField[this.props.activeLevel].otherCheckFields.indexOf(otherFieldName) > -1) {
            const validation = ValidateField[this.props.activeLevel][otherFieldName](
              this.state.updateItem.other[otherField]);
            if (validation.error) {
              error = true;
              errors.other[otherField] = validation.message;
            }
          }
        });
      } else if (ValidateField[this.props.activeLevel].checkFields.indexOf(field) > -1) {
        const validation =
          ValidateField[this.props.activeLevel][field](this.state.updateItem[field])
        ;
        if (validation.error) {
          error = true;
          errors[field] = validation.message;
        }
      }
    });
    if (error) {
      this.setState({ errors, warning: true });
    } else {
      this.props.update(
        this.props.item._id,
        this.state.updateItem,
        this.props.activeLevel,
      );
    }
  }
  updateErrors = (errorObject, warning) => {
    this.setState({ errors: errorObject, warning });
  }
  updateItem = (updateObject) => {
    this.setState({ updateItem: updateObject });
  };
  updateProject = (newID, currentID, canEdit, projects, user) => {
    if (
      newID &&
      newID !== currentID
    ) {
      const project = this.getProject(projects, newID);
      return Permissions.canManage(user, project);
    } else if (
      newID !== currentID
    ) {
      return false;
    }
    return canEdit;
  }
  render() {
    return (
      <DisplayContent
        activeLevel={ this.props.activeLevel }
        cancel={ this.cancel }
        canEdit={ this.state.canEdit }
        delete={ this.delete }
        deleteMessages={ this.props.deleteState[this.props.activeLevel] }
        edit={ this.props.edit }
        editMessages={ this.props.putState[this.props.activeLevel] }
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

DisplayContentContainer.defaultProps = {
  user: DefaultProps.user,
};

DisplayContentContainer.propTypes = {
  activeLevel: PropTypes.string.isRequired,
  cancelMenuAction: PropTypes.func.isRequired,
  changeSelected: PropTypes.func.isRequired,
  delete: PropTypes.func.isRequired,
  deleteState: PropTypes.shape({
    experiment: PropTypes.shape({
      _id: PropTypes.number,
      didDeleteFail: PropTypes.bool,
      message: PropTypes.string,
      isDelete: PropTypes.bool,
    }),
    project: PropTypes.shape({
      _id: PropTypes.number,
      didDeleteFail: PropTypes.bool,
      message: PropTypes.string,
      isDelete: PropTypes.bool,
    }),
    protocol: PropTypes.shape({
      _id: PropTypes.number,
      didDeleteFail: PropTypes.bool,
      message: PropTypes.string,
      isDelete: PropTypes.bool,
    }),
    sample: PropTypes.shape({
      _id: PropTypes.number,
      didDeleteFail: PropTypes.bool,
      message: PropTypes.string,
      isDelete: PropTypes.bool,
    }),
    screen: PropTypes.shape({
      _id: PropTypes.number,
      didDeleteFail: PropTypes.bool,
      message: PropTypes.string,
      isDelete: PropTypes.bool,
    }),
  }).isRequired,
  edit: PropTypes.bool.isRequired,
  item: PropTypes.shape({
    _id: PropTypes.number,
    creatorEmail: PropTypes.string,
    creatorName: PropTypes.string,
    description: PropTypes.string,
    lab: PropTypes.string,
    name: PropTypes.string,
    ownerEmail: PropTypes.string,
    ownerName: PropTypes.string,
    permission: PropTypes.string,
    creationDate: PropTypes.string,
    updateDate: PropTypes.string,
  }).isRequired,
  postState: PropTypes.shape({
    experiment: PropTypes.shape({
      didSubmitFail: PropTypes.bool,
      message: PropTypes.string,
      _id: PropTypes.number,
      isSubmitted: PropTypes.bool,
    }),
    protocol: PropTypes.shape({
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
  projects: projectItemProp.isRequired,
  putState: PropTypes.shape({
    experiment: PropTypes.shape({
      _id: PropTypes.number,
      didPutFail: PropTypes.bool,
      message: PropTypes.string,
      isPut: PropTypes.bool,
    }),
    project: PropTypes.shape({
      _id: PropTypes.number,
      didPutFail: PropTypes.bool,
      message: PropTypes.string,
      isPut: PropTypes.bool,
    }),
    protocol: PropTypes.shape({
      _id: PropTypes.number,
      didPutFail: PropTypes.bool,
      message: PropTypes.string,
      isPut: PropTypes.bool,
    }),
    sample: PropTypes.shape({
      _id: PropTypes.number,
      didPutFail: PropTypes.bool,
      message: PropTypes.string,
      isPut: PropTypes.bool,
    }),
    screen: PropTypes.shape({
      _id: PropTypes.number,
      didPutFail: PropTypes.bool,
      message: PropTypes.string,
      isPut: PropTypes.bool,
    }),
  }).isRequired,
  resetDelete: PropTypes.func.isRequired,
  resetPost: PropTypes.func.isRequired,
  resetPut: PropTypes.func.isRequired,
  selected: selectedProp.isRequired,
  update: PropTypes.func.isRequired,
  user: userProp.isRequired,
  viewID: PropTypes.number.isRequired,
};

const mapDispatchToProps = (dispatch) => {
  return {
    changeSelected: (activeLevel, selected) => {
      dispatch(setIndex(activeLevel, selected));
    },
    delete: (_id, activeLevel, obj) => {
      dispatch(submitDelete(_id, activeLevel, obj));
    },
    resetPost: (activeLevel) => {
      dispatch(resetPost(activeLevel));
    },
    resetPut: (activeLevel) => {
      dispatch(resetPut(activeLevel));
    },
    resetDelete: (activeLevel) => {
      dispatch(resetDelete(activeLevel));
    },
    update: (_id, obj, activeLevel) => {
      dispatch(submitPut(_id, obj, activeLevel));
    },
  };
};

const mapStateToProps = (state) => {
  return {
    deleteState: state.delete,
    postState: state.post,
    projects: state.available.project.items,
    putState: state.put,
    selected: state.selected,
    user: state.user,
  };
};

const Container = connect(
  mapStateToProps,
  mapDispatchToProps,
)(DisplayContentContainer);

export default Container;
