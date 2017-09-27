import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import DisplayScreen from './display-screen';
import { objectEmpty } from '../../../helpers/helpers';
import ValidateField from '../create/validate-fields';

class DisplayScreenContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dialogBoolean: false,
      item: Object.assign({}, this.props.item),
      warning: null,
    };
  }
  deleteScreen = (_id) => {
    this.dialogClose();
    this.props.delete(
      _id,
      'screen',
      {
        project: this.props.selectedIndices.project,
      },
    );
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
        deleteScreen={ this.deleteScreen }
        dialog={ {
          bool: this.state.dialogBoolean,
          close: this.dialogClose,
          open: this.dialogOpen,
        } }
        edit={ this.props.edit }
        errors={ this.props.errors }
        inputChange={ this.inputChange }
        inputWidth={ this.props.inputWidth }
        screen={ this.state.item }
      />
    );
  }
}

DisplayScreenContainer.propTypes = {
  delete: PropTypes.func.isRequired,
  edit: PropTypes.bool.isRequired,
  errors: PropTypes.shape({
    description: PropTypes.string,
    name: PropTypes.string,
  }).isRequired,
  inputWidth: PropTypes.number.isRequired,
  item: PropTypes.shape({
    _id: PropTypes.number,
    cell: PropTypes.string,
    comment: PropTypes.string,
    condition: PropTypes.string,
    creatorEmail: PropTypes.string,
    creatorName: PropTypes.string,
    description: PropTypes.string,
    name: PropTypes.string,
    other: PropTypes.shape({}),
    species: PropTypes.string,
    type: PropTypes.string,
    creationDate: PropTypes.string,
    updateDate: PropTypes.string,
  }).isRequired,
  selectedIndices: PropTypes.shape({
    experiment: PropTypes.number,
    project: PropTypes.number,
    sample: PropTypes.number,
    screen: PropTypes.number,
  }).isRequired,
  updateErrors: PropTypes.func.isRequired,
  updateItem: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
  return {
    selectedIndices: state.selected,
  };
};

const Container = connect(
  mapStateToProps,
)(DisplayScreenContainer);

export default Container;
