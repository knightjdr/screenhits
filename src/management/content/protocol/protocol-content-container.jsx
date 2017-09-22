import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import React from 'react';

import ProtocolContent from './protocol-content';
import { resetPost, submitPost } from '../../../state/post/actions';

const defaultErrors = {
  protocolName: '',
};

const defaultState = {
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
  changeNew = () => {
    this.setState((prevState) => {
      return {
        new: !prevState.new,
      };
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
        name: this.state.protocolName,
        subSections: JSON.parse(JSON.stringify(this.state.fields)),
        target: 'protocol',
      };
      this.props.createProtocol(protocolObj);
    }
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
        changeNew={ this.changeNew }
        createProtocol={ this.createProtocol }
        details={ this.state.details }
        errors={ this.state.errors }
        fields={ this.state.fields }
        fieldError={ this.state.fieldError }
        fieldName={ this.state.fieldName }
        inputChange={ this.inputChange }
        inputChangeSubField={ this.inputChangeSubField }
        new={ this.state.new }
        protocolName={ this.state.protocolName }
        protocols={ this.props.protocols }
        removeField={ this.removeField }
        selectedProtocol={ this.state.selectedProtocol }
        updateManage={ this.updateProtocol }
      />
    );
  }
}

ProtocolContentContainer.propTypes = {
  createProtocol: PropTypes.func.isRequired,
  protocols: PropTypes.shape({
    didGetFail: PropTypes.bool,
    message: PropTypes.string,
    isGet: PropTypes.bool,
    list: PropTypes.arrayOf(
      PropTypes.shape({
      }),
    ),
  }).isRequired,
  resetPost: PropTypes.func.isRequired,
};

const mapDispatchToProps = (dispatch) => {
  return {
    createProtocol: (obj) => {
      dispatch(submitPost('protocol', obj));
    },
    resetPost: () => {
      dispatch(resetPost('protocol'));
    },
  };
};

const mapStateToProps = (state) => {
  return {
    protocols: state.protocol,
  };
};

const Container = connect(
  mapStateToProps,
  mapDispatchToProps,
)(ProtocolContentContainer);

export default Container;
