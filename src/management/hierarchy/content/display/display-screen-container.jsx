import deepEqual from 'deep-equal';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import DisplayScreen from './display-screen';
import Download from '../create/download-datasource';
import Fields from '../../../../modules/fields';
import ValidateField from '../../../../modules/validate-field';
import { objectEmpty } from '../../../../helpers/helpers';

const timeout = {};

class DisplayScreenContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: {
        cells: [],
        species: [],
      },
      dialog: {
        delete: false,
        help: false,
        text: '',
        title: '',
      },
      item: JSON.parse(JSON.stringify(this.props.item)),
      warning: null,
    };
  }
  componentWillReceiveProps = (nextProps) => {
    const { item } = nextProps;
    if (!deepEqual(item, this.props.item)) {
      this.setState({
        item: JSON.parse(JSON.stringify(item)),
      });
    }
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
  downloadDataSource = (route, text) => {
    const getDataSource = () => {
      const queryString = `text=${text}`;
      Download(
        route,
        queryString,
        this.props.token
      )
        .then((data) => {
          this.setState(({ dataSource }) => {
            const newDataSource = {};
            newDataSource[route] = data;
            return {
              dataSource: Object.assign(
                {},
                dataSource,
                newDataSource,
              ),
            };
          });
        })
      ;
    };
    window.clearTimeout(timeout[route]);
    if (text) {
      timeout[route] = setTimeout(getDataSource, 400);
    }
  }
  inputChange = (field, value, other, type) => {
    this.setState(({ dataSource, item }) => {
      const updateObject = JSON.parse(JSON.stringify(item));
      // check if field is valid and update errors object
      const errors = Object.assign({}, this.props.errors);
      if (field === 'species') {
        const validate = ValidateField.screen.checkFields.indexOf(field) > 0 ?
          ValidateField.screen[field](value)
        :
        {
          error: false,
          message: null,
        };
        errors[field] = validate.error ? validate.message : null;
        updateObject[field] = value;
        // get taxonID
        if (dataSource.species.length > 0) {
          const speciesIndex = dataSource.species.findIndex((entry) => {
            return entry.name === value;
          });
          if (speciesIndex > -1) {
            updateObject.taxonID = dataSource.species[speciesIndex]._id;
          }
        }
      } else if (field === 'cell') {
        const validate = ValidateField.screen.checkFields.indexOf(field) > 0 ?
          ValidateField.screen[field](value)
        :
        {
          error: false,
          message: null,
        };
        errors[field] = validate.error ? validate.message : null;
        updateObject[field] = value;
        // get cell ID
        if (dataSource.cells.length > 0) {
          const cellsIndex = dataSource.cells.findIndex((entry) => {
            return entry.name === value;
          });
          if (cellsIndex > -1) {
            updateObject.cellID = dataSource.cells[cellsIndex]._id;
          }
        }
      } else if (!other) {
        const validate = ValidateField.screen.checkFields.indexOf(field) > 0 ?
          ValidateField.screen[field](value)
        :
        {
          error: false,
          message: null,
        };
        updateObject[field] = value;
        errors[field] = validate.error ? validate.message : null;
      } else {
        const validate = ValidateField.screen[`${type}_${field}`] ?
          ValidateField.screen[`${type}_${field}`](value) :
        {
          error: false,
          message: null,
        };
        updateObject.other[field] = value;
        if (!errors.other) {
          errors.other = {};
        }
        errors.other[field] = validate.error ? validate.message : null;
      }
      const warning = !objectEmpty(errors);
      this.props.updateErrors(errors, warning);
      // if screen type changes, add/remove neccessary fields
      if (field === 'type') {
        updateObject.other = {};
        Fields.screen.other[value].forEach((otherFields) => {
          updateObject.other[otherFields.name] = otherFields.defaultValue;
        });
      }
      this.props.updateItem(updateObject);
      return { item: updateObject };
    });
  }
  render() {
    return (
      <DisplayScreen
        canEdit={ this.props.canEdit }
        dataSource={ this.state.dataSource }
        deleteScreen={ this.deleteScreen }
        dialog={ {
          close: this.dialogClose,
          delete: this.state.dialog.delete,
          help: this.state.dialog.help,
          open: this.dialogOpen,
          text: this.state.dialog.text,
          title: this.state.dialog.title,
        } }
        downloadDataSource={ this.downloadDataSource }
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
  canEdit: PropTypes.bool.isRequired,
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
  token: PropTypes.string.isRequired,
  updateErrors: PropTypes.func.isRequired,
  updateItem: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
  return {
    selectedIndices: state.selected,
    token: state.token,
  };
};

const Container = connect(
  mapStateToProps,
)(DisplayScreenContainer);

export default Container;
