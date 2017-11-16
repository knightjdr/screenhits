import deepEqual from 'deep-equal';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import DisplaySample from './display-sample';
import Download from '../../../helpers/download';
import ViewSample from './sample/view-sample';
import { objectEmpty } from '../../../helpers/helpers';
import ValidateField from '../../../modules/validate-field';

class DisplaySampleContainer extends React.Component {
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
  componentWillReceiveProps = (nextProps) => {
    const { item } = nextProps;
    // update item when store item updates
    if (!deepEqual(item, this.props.item)) {
      this.setState({
        item: Object.assign({}, item),
      });
    }
  }
  deleteSample = (_id) => {
    this.dialogClose();
    this.props.delete(
      _id,
      'sample',
      {
        experiment: this.props.selectedIndices.experiment,
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
  downloadSample = () => {
    const queryString = `target=${this.state.item._id}&format=tsv`;
    Download(
      this.state.item.name,
      'tsv',
      queryString,
      'sample',
      this.props.user
    )
      .catch((error) => {
        this.setState({
          dialog: {
            delete: false,
            help: true,
            text: error.text,
            title: error.title,
          },
        });
      })
    ;
  }
  inputChange = (field, value) => {
    // check if field is valid and update errors object
    const errors = Object.assign({}, this.props.errors);
    const validate = ValidateField.sample.checkFields.indexOf(field) > 0 ?
      ValidateField.sample[field](value)
      :
      { error: false }
    ;
    errors[field] = validate.error ? validate.message : null;
    const warning = !objectEmpty(errors);
    this.props.updateErrors(errors, warning);
    // update item state
    const updateObject = JSON.parse(JSON.stringify(this.state.item));
    if (
      typeof updateObject[field] === 'object' &&
      updateObject[field].isArray
    ) {
      updateObject[field] = Object.assign([], value);
    } else {
      updateObject[field] = value;
    }
    this.setState({ item: updateObject });
    this.props.updateItem(updateObject);
  }
  viewSample = () => {
    ViewSample(this.state.item._id, this.state.item.name, 'html', this.props.user);
  }
  render() {
    return (
      <div>
        <DisplaySample
          deleteSample={ this.deleteSample }
          dialog={ {
            close: this.dialogClose,
            delete: this.state.dialog.delete,
            help: this.state.dialog.help,
            open: this.dialogOpen,
            text: this.state.dialog.text,
            title: this.state.dialog.title,
          } }
          downloadSample={ this.downloadSample }
          edit={ this.props.edit }
          errors={ this.props.errors }
          inputChange={ this.inputChange }
          inputWidth={ this.props.inputWidth }
          sample={ this.state.item }
          viewSample={ this.viewSample }
        />
      </div>

    );
  }
}

DisplaySampleContainer.defaultProps = {
  user: {
    email: null,
    lab: null,
    name: null,
    token: null,
  },
};

DisplaySampleContainer.propTypes = {
  delete: PropTypes.func.isRequired,
  edit: PropTypes.bool.isRequired,
  errors: PropTypes.shape({
    name: PropTypes.string,
    replicate: PropTypes.string,
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
    replicate: PropTypes.string,
    timepoint: PropTypes.string,
    creationDate: PropTypes.string,
    updateDate: PropTypes.string,
  }).isRequired,
  selectedIndices: PropTypes.shape({
    experiment: PropTypes.number,
    project: PropTypes.number,
    sample: PropTypes.number,
    screen: PropTypes.number,
  }).isRequired,
  user: PropTypes.shape({
    email: PropTypes.string,
    lab: PropTypes.string,
    name: PropTypes.string,
    token: PropTypes.string,
  }),
  updateErrors: PropTypes.func.isRequired,
  updateItem: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
  return {
    selectedIndices: state.selected,
    user: state.user,
  };
};

const Container = connect(
  mapStateToProps,
)(DisplaySampleContainer);

export default Container;
