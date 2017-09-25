import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import React from 'react';

import ProtocolContent from './protocol-content';
import { getData } from '../../../state/get/data-actions';
import { resetPost, submitPost } from '../../../state/post/actions';

const defaultErrors = {
  protocolName: '',
};

const defaultState = {
  display: false,
  edit: false,
  editProtocol: {
    name: '',
    subSections: [],
  },
  errors: defaultErrors,
  fields: [],
  fieldError: '',
  fieldName: '',
  new: false,
  protocolName: '',
  selectedProtocol: null,
};

class ProtocolContentContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = JSON.parse(JSON.stringify(defaultState));
  }
  componentWillMount = () => {
    this.props.protocolGet();
  }
  componentWillUnmount = () => {
    this.props.resetPost();
  }
  addField = (fieldName) => {
    // make sure fieldName doesn't exist
    let alreadyExists = false;
    this.state.fields.forEach((field) => {
      if (field.name === fieldName) {
        alreadyExists = true;
      }
    });
    if (alreadyExists) {
      this.setState({
        fieldError: `A field named ${fieldName} already exists`,
      });
    } else if (fieldName) {
      this.setState((prevState) => {
        return {
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
      });
    }
  }
  cancel = () => {
    this.props.resetPost();
    this.setState(JSON.parse(JSON.stringify(defaultState)));
  }
  cancelEdit = () => {
    this.setState({
      display: true,
      edit: false,
      editProtocol: {
        name: '',
        subSections: [],
      },
      new: false,
    });
  }
  changeEdit = () => {
    this.setState((prevState, props) => {
      return {
        display: false,
        edit: true,
        editProtocol: props.protocols.items[prevState.selectedProtocol],
        new: false,
      };
    });
  }
  changeNew = () => {
    this.setState({
      display: false,
      edit: false,
      new: true,
      selectedProtocol: null,
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
        name: this.state.protocolName,
        subSections: JSON.parse(JSON.stringify(this.state.fields)),
        target: 'protocol',
      };
      this.props.createProtocol(protocolObj);
    }
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
      console.log(newEditProtocol);
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
    this.setState({
      display: true,
      edit: false,
      new: false,
      selectedProtocol: value,
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
  updateProtocol = () => {
  }
  render() {
    return (
      <ProtocolContent
        addField={ this.addField }
        cancel={ this.cancel }
        cancelEdit={ this.cancelEdit }
        changeEdit={ this.changeEdit }
        changeNew={ this.changeNew }
        createProtocol={ this.createProtocol }
        details={ this.state.details }
        display={ this.state.display }
        edit={ this.state.edit }
        editChangeField={ this.editChangeField }
        editProtocol={ this.state.editProtocol }
        editRemoveField={ this.editRemoveField }
        errors={ this.state.errors }
        fields={ this.state.fields }
        fieldError={ this.state.fieldError }
        fieldName={ this.state.fieldName }
        inputChange={ this.inputChange }
        inputChangeSubField={ this.inputChangeSubField }
        new={ this.state.new }
        postState={ this.props.postState }
        protocolChange={ this.protocolChange }
        protocolName={ this.state.protocolName }
        protocols={ this.props.protocols }
        removeField={ this.removeField }
        selectedProtocol={ this.state.selectedProtocol }
        updateProtocol={ this.updateProtocol }
      />
    );
  }
}

ProtocolContentContainer.defaultProps = {
  user: {
    email: null,
    lab: null,
    name: null,
  },
};

ProtocolContentContainer.propTypes = {
  createProtocol: PropTypes.func.isRequired,
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
  resetPost: PropTypes.func.isRequired,
  user: PropTypes.shape({
    email: PropTypes.string,
    lab: PropTypes.string,
    name: PropTypes.string,
  }),
};

const mapDispatchToProps = (dispatch) => {
  return {
    createProtocol: (obj) => {
      dispatch(submitPost('protocol', obj));
    },
    protocolGet: () => {
      dispatch(getData('protocol', {}));
    },
    resetPost: () => {
      dispatch(resetPost('protocol'));
    },
  };
};

const mapStateToProps = (state) => {
  return {
    postState: state.post.protocol,
    protocols: state.available.protocol,
    user: state.user,
  };
};

const Container = connect(
  mapStateToProps,
  mapDispatchToProps,
)(ProtocolContentContainer);

export default Container;
