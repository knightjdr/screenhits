import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import React from 'react';

import DefaultProps from '../../../../types/default-props';
import ProtocolContent from './protocol-content';
import { getData } from '../../../../state/get/data-actions';
import { resetPost, submitPost } from '../../../../state/post/actions';
import { resetPut, submitPut } from '../../../../state/put/actions';
import { resetDelete, submitDelete } from '../../../../state/delete/actions';
import { userProp } from '../../../../types/index';

const defaultErrors = {
  protocolName: '',
};

const defaultState = {
  dialogBoolean: false,
  display: false,
  edit: false,
  editFieldName: '',
  editProtocol: {
    _id: '',
    creationDate: '',
    creatorEmail: '',
    creatorName: '',
    name: '',
    subSections: [],
    target: 'protocol',
  },
  errors: defaultErrors,
  fields: [],
  fieldError: '',
  fieldName: '',
  new: false,
  protocolName: '',
  selectedProtocol: null,
  selectedProtocolIndex: null,
};

class ProtocolContentContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = JSON.parse(JSON.stringify(defaultState));
  }
  componentWillMount = () => {
    this.props.protocolGet();
  }
  componentWillReceiveProps = (nextProps) => {
    const { deleteState, postState, protocols, putState } = nextProps;
    let newState = {};
    // on a succseful creation, set the selected protocol to the last array item
    if (
      postState.message &&
      !postState.didSubmitFail
    ) {
      newState = Object.assign(
        {},
        newState,
        {
          display: true,
          edit: false,
          new: false,
          protocolName: '',
          selectedProtocol: protocols.items[protocols.items.length - 1]._id,
          selectedProtocolIndex: protocols.items.length - 1,
        },
      );
    }
    // on successful delete
    if (
      this.props.deleteState.isDelete &&
      !deleteState.isDelete &&
      !deleteState.didDeleteFail
    ) {
      newState = Object.assign(
        {},
        newState,
        {
          display: false,
          selectedProtocol: null,
          selectedProtocolIndex: null,
        },
      );
    }
    // on successful edit
    if (
      this.props.putState.isPut &&
      !putState.isPut &&
      !putState.didPutFail
    ) {
      this.cancelEdit();
    }
    this.setState(newState);
  }
  componentWillUnmount = () => {
    this.resetMessages();
  }
  addField = (fieldName) => {
    this.setState((prevState) => {
      // make sure fieldName doesn't exist
      let alreadyExists = fieldName === 'name';
      let newState;
      prevState.fields.forEach((field) => {
        if (field.name === fieldName) {
          alreadyExists = true;
        }
      });
      if (alreadyExists) {
        newState = {
          fieldError: `A field named ${fieldName} already exists`,
        };
      } else if (fieldName) {
        newState = {
          fieldError: '',
          fieldName: '',
          fields: [
            ...prevState.fields,
            {
              name: fieldName,
              content: '',
            },
          ],
        };
      }
      return newState;
    });
  }
  addFieldEdit = (fieldName) => {
    this.setState((prevState) => {
      // make sure fieldName doesn't exist
      let alreadyExists = fieldName === 'name';
      let newState;
      prevState.editProtocol.subSections.forEach((field) => {
        if (field.name === fieldName) {
          alreadyExists = true;
        }
      });
      if (alreadyExists) {
        newState = {
          editFieldError: `A field named ${fieldName} already exists`,
        };
      } else if (fieldName) {
        const newEditProtocol = JSON.parse(JSON.stringify(prevState.editProtocol));
        newEditProtocol.subSections.push({
          name: fieldName,
          content: '',
        });
        newState = {
          editFieldError: '',
          editFieldName: '',
          editProtocol: newEditProtocol,
        };
      }
      return newState;
    });
  }
  cancel = () => {
    this.resetMessages();
    this.setState(JSON.parse(JSON.stringify(defaultState)));
  }
  cancelEdit = () => {
    this.setState({
      display: true,
      edit: false,
      editProtocol: {
        _id: '',
        creationDate: '',
        creatorEmail: '',
        creatorName: '',
        name: '',
        subSections: [],
        target: 'protocol',
      },
      new: false,
    });
  }
  changeEdit = () => {
    this.setState((prevState, props) => {
      return {
        display: false,
        edit: true,
        editProtocol: props.protocols.items[this.state.selectedProtocolIndex],
        new: false,
      };
    });
  }
  changeNew = () => {
    this.resetMessages();
    this.setState({
      display: false,
      edit: false,
      new: true,
      selectedProtocol: null,
      selectedProtocolIndex: null,
    });
  }
  createProtocol = () => {
    if (!this.state.protocolName) {
      this.setState((prevState) => {
        const newErrors = Object.assign({}, prevState.errors);
        newErrors.protocolName = 'The protocol must be given a name';
        return {
          errors: newErrors,
        };
      });
    } else {
      const protocolObj = {
        creatorEmail: this.props.user.email,
        creatorName: this.props.user.name,
        lab: this.props.user.lab,
        name: this.state.protocolName,
        subSections: JSON.parse(JSON.stringify(this.state.fields)),
        target: 'protocol',
      };
      this.resetMessages();
      this.props.createProtocol(protocolObj);
    }
  }
  deleteProtocol = (_id) => {
    this.dialogClose();
    this.resetMessages();
    this.props.delete(_id);
  }
  dialogClose = () => {
    this.setState({
      dialogBoolean: false,
    });
  }
  dialogOpen = () => {
    this.setState({
      dialogBoolean: true,
    });
  }
  editChangeField = (field, value, index = false) => {
    this.setState((prevState) => {
      const newEditProtocol = JSON.parse(JSON.stringify(prevState.editProtocol));
      if (!Number.isInteger(index)) {
        newEditProtocol[field] = value;
      } else {
        newEditProtocol.subSections[index] = {
          name: newEditProtocol.subSections[index].name,
          content: value,
        };
      }
      return {
        editProtocol: newEditProtocol,
      };
    });
  }
  editRemoveField = (index) => {
    this.setState((prevState) => {
      const newEditProtocol = JSON.parse(JSON.stringify(prevState.editProtocol));
      newEditProtocol.subSections.splice(index, 1);
      return {
        editProtocol: newEditProtocol,
      };
    });
  }
  inputChange = (field, value) => {
    const newState = {};
    newState[field] = value;
    this.setState((prevState) => {
      newState.errors = Object.assign({}, prevState.errors);
      if (
        value &&
        newState.errors[field]
      ) {
        newState.errors[field] = '';
      }
      return newState;
    });
  }
  inputChangeEdit = (value) => {
    this.setState({
      editFieldError: '',
      editFieldName: value,
    });
  }
  inputChangeSubField = (index, value) => {
    this.setState((prevState) => {
      const newFields = JSON.parse(JSON.stringify(prevState.fields));
      newFields[index] = {
        name: newFields[index].name,
        content: value,
      };
      return {
        fields: newFields,
      };
    });
  }
  protocolChange = (value) => {
    this.resetMessages();
    this.setState((prevState, props) => {
      return {
        display: true,
        edit: false,
        new: false,
        selectedProtocol: value,
        selectedProtocolIndex: props.protocols.items.findIndex((protocol) => {
          return protocol._id === value;
        }),
      };
    });
  }
  removeField = (index) => {
    this.setState((prevState) => {
      const newFields = JSON.parse(JSON.stringify(prevState.fields));
      newFields.splice(index, 1);
      return {
        fields: newFields,
      };
    });
  }
  resetMessages = () => {
    if (this.props.deleteState.message) {
      this.props.resetDelete('protocol');
    }
    if (this.props.postState.message) {
      this.props.resetPost('protocol');
    }
    if (this.props.putState.message) {
      this.props.resetPut('protocol');
    }
  }
  updateProtocol = () => {
    this.resetMessages();
    this.props.update(
      this.state.editProtocol._id,
      this.state.editProtocol
    );
  }
  render() {
    return (
      <ProtocolContent
        addField={ this.addField }
        addFieldEdit={ this.addFieldEdit }
        back={ this.props.cancelMenuAction }
        cancel={ this.cancel }
        cancelEdit={ this.cancelEdit }
        changeEdit={ this.changeEdit }
        changeNew={ this.changeNew }
        createProtocol={ this.createProtocol }
        deleteMessages={ this.props.deleteState }
        deleteProtocol={ this.deleteProtocol }
        dialog={ {
          bool: this.state.dialogBoolean,
          close: this.dialogClose,
          open: this.dialogOpen,
        } }
        details={ this.state.details }
        display={ this.state.display }
        edit={ this.state.edit }
        editChangeField={ this.editChangeField }
        editFieldError={ this.state.editFieldError }
        editFieldName={ this.state.editFieldName }
        editMessages={ this.props.putState }
        editProtocol={ this.state.editProtocol }
        editRemoveField={ this.editRemoveField }
        errors={ this.state.errors }
        fields={ this.state.fields }
        fieldError={ this.state.fieldError }
        fieldName={ this.state.fieldName }
        inputChange={ this.inputChange }
        inputChangeEdit={ this.inputChangeEdit }
        inputChangeSubField={ this.inputChangeSubField }
        new={ this.state.new }
        postState={ this.props.postState }
        protocolChange={ this.protocolChange }
        protocolName={ this.state.protocolName }
        protocols={ this.props.protocols }
        removeField={ this.removeField }
        selectedProtocol={ this.state.selectedProtocol }
        selectedProtocolIndex={ this.state.selectedProtocolIndex }
        updateProtocol={ this.updateProtocol }
      />
    );
  }
}

ProtocolContentContainer.defaultProps = {
  user: DefaultProps.user,
};

ProtocolContentContainer.propTypes = {
  cancelMenuAction: PropTypes.func.isRequired,
  createProtocol: PropTypes.func.isRequired,
  delete: PropTypes.func.isRequired,
  deleteState: PropTypes.shape({
    _id: PropTypes.number,
    didDeleteFail: PropTypes.bool,
    message: PropTypes.string,
    isDelete: PropTypes.bool,
  }).isRequired,
  postState: PropTypes.shape({
    didSubmitFail: PropTypes.bool,
    _id: PropTypes.number,
    isSubmitted: PropTypes.bool,
    message: PropTypes.string,
  }).isRequired,
  protocolGet: PropTypes.func.isRequired,
  protocols: PropTypes.shape({
    didInvalidate: PropTypes.bool,
    isFetching: PropTypes.bool,
    items: PropTypes.arrayOf(
      PropTypes.shape({
      }),
    ),
    message: PropTypes.string,
  }).isRequired,
  putState: PropTypes.shape({
    _id: PropTypes.number,
    didPutFail: PropTypes.bool,
    message: PropTypes.string,
    isPut: PropTypes.bool,
  }).isRequired,
  resetDelete: PropTypes.func.isRequired,
  resetPost: PropTypes.func.isRequired,
  resetPut: PropTypes.func.isRequired,
  update: PropTypes.func.isRequired,
  user: userProp,
};

const mapDispatchToProps = (dispatch) => {
  return {
    createProtocol: (obj) => {
      dispatch(submitPost('protocol', obj, false));
    },
    delete: (_id) => {
      dispatch(submitDelete(_id, 'protocol', {}));
    },
    protocolGet: () => {
      dispatch(getData('protocol', {}, null));
    },
    resetPut: () => {
      dispatch(resetPut('protocol'));
    },
    resetDelete: () => {
      dispatch(resetDelete('protocol'));
    },
    resetPost: () => {
      dispatch(resetPost('protocol'));
    },
    update: (_id, obj) => {
      dispatch(submitPut(_id, obj, 'protocol'));
    },
  };
};

const mapStateToProps = (state) => {
  return {
    deleteState: state.delete.protocol,
    postState: state.post.protocol,
    putState: state.put.protocol,
    protocols: state.available.protocol,
    user: state.user,
  };
};

const Container = connect(
  mapStateToProps,
  mapDispatchToProps,
)(ProtocolContentContainer);

export default Container;
