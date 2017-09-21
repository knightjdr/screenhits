import PropTypes from 'prop-types';
import React from 'react';

import DisplayScreen from './display-screen';
import { objectEmpty } from '../../../helpers/helpers';
import ValidateField from '../create/validate-fields';

class DisplayScreenContainer extends React.Component {
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
      <DisplayScreen
        edit={ this.props.edit }
        errors={ this.props.errors }
        inputChange={ this.inputChange }
        inputWidth={ this.props.inputWidth }
        item={ this.state.item }
      />
    );
  }
}

DisplayScreenContainer.propTypes = {
  edit: PropTypes.bool.isRequired,
  errors: PropTypes.shape({
    description: PropTypes.string,
    name: PropTypes.string,
  }).isRequired,
  inputWidth: PropTypes.number.isRequired,
  item: PropTypes.shape({
    _id: PropTypes.number,
    'creator-email': PropTypes.string,
    'creator-name': PropTypes.string,
    description: PropTypes.string,
    name: PropTypes.string,
    'creation-date': PropTypes.string,
    'update-date': PropTypes.string,
  }).isRequired,
  updateErrors: PropTypes.func.isRequired,
  updateItem: PropTypes.func.isRequired,
};

export default DisplayScreenContainer;
