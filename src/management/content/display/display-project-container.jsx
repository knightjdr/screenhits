import PropTypes from 'prop-types';
import React from 'react';

import DisplayProject from './display-project';
import ValidateField from '../modules/validate-field';
import { objectEmpty } from '../../../helpers/helpers';

class DisplayProjectContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dialog: {
        delete: false,
      },
      item: Object.assign({}, this.props.item),
      warning: null,
    };
  }
  deleteProject = (_id) => {
    this.dialogClose();
    this.props.delete(_id, 'project', {});
  }
  dialogClose = () => {
    this.setState({
      dialog: {
        delete: false,
      },
    });
  }
  dialogOpen = () => {
    this.setState({
      dialog: {
        delete: true,
      },
    });
  }
  inputChange = (field, value) => {
    // check if field is valid and update errors object
    const errors = Object.assign({}, this.props.errors);
    const validate = ValidateField.project.checkFields.indexOf(field) > 0 ?
      ValidateField.experiment[field](value)
      :
      { error: false }
    ;
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
        deleteProject={ this.deleteProject }
        dialog={ {
          delete: this.state.dialog.delete,
          close: this.dialogClose,
          open: this.dialogOpen,
        } }
        edit={ this.props.edit }
        errors={ this.props.errors }
        inputChange={ this.inputChange }
        project={ this.state.item }
      />
    );
  }
}

DisplayProjectContainer.propTypes = {
  delete: PropTypes.func.isRequired,
  edit: PropTypes.bool.isRequired,
  errors: PropTypes.shape({
    description: PropTypes.string,
    name: PropTypes.string,
    permission: PropTypes.string,
  }).isRequired,
  item: PropTypes.shape({
    _id: PropTypes.number,
    comment: PropTypes.string,
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
  updateErrors: PropTypes.func.isRequired,
  updateItem: PropTypes.func.isRequired,
};

export default DisplayProjectContainer;
