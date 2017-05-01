import PropTypes from 'prop-types';
import React from 'react';

import DisplayProject from './display-project';
import { objectEmpty } from '../../../helpers/helpers';
import ValidateField from '../create/validate-fields';

class DisplayProjectContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      item: Object.assign({}, this.props.item),
      warning: null,
    };
  }
  inputChange = (field, value) => {
    // check if field is valid and update errors object
    const errors = Object.assign({}, this.props.errors);
    const validate = ValidateField.project[field](value);
    errors[field] = validate.error ? validate.message : null;
    const warning = !objectEmpty(errors);
    this.props.updateErrors(errors, warning);
    // update item state
    const updateObject = Object.assign({}, this.state.item);
    updateObject[field] = value;
    this.setState({ item: updateObject });
    this.props.updateItem(updateObject);
  }
  render() {
    return (
      <DisplayProject
        edit={ this.props.edit }
        errors={ this.props.errors }
        inputChange={ this.inputChange }
        item={ this.state.item }
      />
    );
  }
}

DisplayProjectContainer.propTypes = {
  edit: PropTypes.bool.isRequired,
  errors: PropTypes.shape({
    description: null,
    name: null,
    permission: null,
  }).isRequired,
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
  updateErrors: PropTypes.func.isRequired,
  updateItem: PropTypes.func.isRequired,
};

export default DisplayProjectContainer;
