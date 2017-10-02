import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import DisplayExperiment from './display-experiment';
import { getData } from '../../../state/get/data-actions';
import { objectEmpty } from '../../../helpers/helpers';
import ValidateField from '../create/validate-fields';

class DisplayExperimentContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dialog: {
        delete: false,
        help: false,
        text: '',
        title: '',
      },
      item: Object.assign({}, this.props.item),
      warning: null,
    };
  }
  componentWillMount = () => {
    this.props.protocolGet();
  }
  deleteExperiment = (_id) => {
    this.dialogClose();
    this.props.delete(
      _id,
      'experiment',
      {
        project: this.props.selectedIndices.project,
        screen: this.props.selectedIndices.screen,
      },
    );
  }
  dialogClose = () => {
    this.setState({
      dialog: {
        delete: false,
        help: false,
      },
    });
  }
  dialogOpen = (type, title = '', text = '') => {
    this.setState((prevState) => {
      const newState = Object.assign({}, prevState.dialog);
      newState[type] = true;
      newState.text = text;
      newState.title = title;
      return {
        dialog: newState,
      };
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
      <DisplayExperiment
        deleteExperiment={ this.deleteExperiment }
        dialog={ {
          close: this.dialogClose,
          delete: this.state.dialog.delete,
          help: this.state.dialog.help,
          open: this.dialogOpen,
          text: this.state.dialog.text,
          title: this.state.dialog.title,
        } }
        edit={ this.props.edit }
        errors={ this.props.errors }
        experiment={ this.state.item }
        inputChange={ this.inputChange }
        inputWidth={ this.props.inputWidth }
        protocols={ this.props.protocols }
      />
    );
  }
}

DisplayExperimentContainer.propTypes = {
  delete: PropTypes.func.isRequired,
  edit: PropTypes.bool.isRequired,
  errors: PropTypes.shape({
    description: PropTypes.string,
    name: PropTypes.string,
  }).isRequired,
  inputWidth: PropTypes.number.isRequired,
  item: PropTypes.shape({
    _id: PropTypes.number,
    comment: PropTypes.string,
    concentration: PropTypes.string,
    creatorEmail: PropTypes.string,
    creatorName: PropTypes.string,
    description: PropTypes.string,
    name: PropTypes.string,
    timepoint: PropTypes.string,
    creationDate: PropTypes.string,
    updateDate: PropTypes.string,
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
  selectedIndices: PropTypes.shape({
    experiment: PropTypes.number,
    project: PropTypes.number,
    sample: PropTypes.number,
    screen: PropTypes.number,
  }).isRequired,
  updateErrors: PropTypes.func.isRequired,
  updateItem: PropTypes.func.isRequired,
};

const mapDispatchToProps = (dispatch) => {
  return {
    protocolGet: () => {
      dispatch(getData('protocol', {}));
    },
  };
};

const mapStateToProps = (state) => {
  return {
    protocols: state.available.protocol,
    selectedIndices: state.selected,
  };
};

const Container = connect(
  mapStateToProps,
  mapDispatchToProps,
)(DisplayExperimentContainer);

export default Container;
