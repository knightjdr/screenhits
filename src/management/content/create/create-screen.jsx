import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import FontAwesome from 'react-fontawesome';
import IconButton from 'material-ui/IconButton';
import HelpIcon from 'material-ui/svg-icons/action/help';
import MenuItem from 'material-ui/MenuItem';
import muiThemeable from 'material-ui/styles/muiThemeable';
import PropTypes from 'prop-types';
import React from 'react';
import SelectField from 'material-ui/SelectField';
import TextField from 'material-ui/TextField';

import FieldsScreen from './forms/fields-screen';
import { uppercaseFirst } from '../../../helpers/helpers';
import SelectInput from './select-input/select-input-container';
import SpeciesDataSource from '../../../assets/data/species';
import CellsDataSource from '../../../assets/data/cells';

const Fields = {
  screen: FieldsScreen,
};

const helpIconStyle = {
  marginTop: 25,
};

const inputStyle = {
  marginLeft: 4,
  marginRight: 4,
  maxWidth: 500,
};

const inputWithChildrenStyle = {
  display: 'flex',
  marginLeft: 4,
  marginRight: 4,
};

class CreateScreen extends React.Component {
  dialogClose = () => {
    return (
    [
      <FlatButton
        backgroundColor={ this.props.muiTheme.palette.warning }
        hoverColor={ this.props.muiTheme.palette.warningHover }
        label="Close"
        onTouchTap={ this.props.dialog.close }
      />,
    ]);
  }
  inputChangeCondition = (e) => {
    this.props.inputChange('condition', e.target.value);
  }
  inputChangeDescription = (e) => {
    this.props.inputChange('description', e.target.value);
  }
  inputChangeName = (e) => {
    this.props.inputChange('name', e.target.value);
  }
  inputChangeType = (e, index, value) => {
    this.props.inputChange('type', value);
  }
  render() {
    return (
      <div>
        <div
          style={ {
            color: this.props.muiTheme.palette.alternateTextColor,
          } }
        >
          <FontAwesome name="info-circle" /> Name your screen and provide all details below.
        </div>
        <div
          style={ {
            display: 'flex',
            flexWrap: 'wrap',
          } }
        >
          <TextField
            errorText={ this.props.errors.name }
            floatingLabelText="Screen name (short)"
            fullWidth={ true }
            multiLine={ true }
            onChange={ this.inputChangeName }
            rows={ 1 }
            rowsMax={ 2 }
            style={ inputStyle }
            value={ this.props.formData.name }
          />
          <TextField
            errorText={ this.props.errors.description }
            floatingLabelText="Project description"
            fullWidth={ true }
            multiLine={ true }
            onChange={ this.inputChangeDescription }
            rows={ 1 }
            rowsMax={ 4 }
            style={ inputStyle }
            value={ this.props.formData.description }
          />
          <SelectField
            errorText={ this.props.errors.type }
            floatingLabelText="Screen type"
            fullWidth={ true }
            listStyle={ {
              paddingBottom: 0,
              paddingTop: 0,
            } }
            onChange={ this.inputChangeType }
            style={ inputStyle }
            value={ this.props.formData.type }
          >
            { Fields.screen.type.values.map((type) => {
              return (
                <MenuItem
                  key={ type }
                  value={ type }
                  primaryText={ type }
                />
              );
            }) }
          </SelectField>
          <SelectInput
            dataSource={ SpeciesDataSource }
            errorText={ this.props.errors.species }
            inputChange={ this.props.inputChange }
            inputWidth={ this.props.inputWidth }
            labelText="Species"
            options={ Fields.screen.species.values }
            type="species"
            value={ this.props.formData.species }
          />
          <SelectInput
            dataSource={ CellsDataSource }
            errorText={ this.props.errors.cell }
            inputChange={ this.props.inputChange }
            inputWidth={ this.props.inputWidth }
            labelText="Cell type"
            options={ Fields.screen.cell.values }
            type="cell"
            value={ this.props.formData.cell }
          />
          <div
            style={ Object.assign(
              {},
              inputWithChildrenStyle,
              {
                width: this.props.inputWidth,
              },
            ) }
          >
            <TextField
              floatingLabelText="Condition (optional)"
              fullWidth={ true }
              multiLine={ true }
              onChange={ this.inputChangeCondition }
              rows={ 1 }
              rowsMax={ 2 }
              value={ this.props.formData.condition }
            />
            <IconButton
              onTouchTap={ () => {
                this.props.dialogOpen('Help for the "Condition" field', Fields.screen.condition.help);
              } }
              style={ helpIconStyle }
              tooltip="Help"
              tooltipPosition="top-center"
            >
              <HelpIcon
                color={ this.props.muiTheme.palette.alternateTextColor }
              />
            </IconButton>
          </div>
          { this.props.formData.type &&
            Fields.screen.other[this.props.formData.type].map((field) => {
              return (
                field.type === 'select' ?
                  <SelectField
                    errorText={ this.props.errors.other[field.name] }
                    floatingLabelText={ uppercaseFirst(field.name) }
                    fullWidth={ true }
                    key={ field.name }
                    listStyle={ {
                      paddingBottom: 0,
                      paddingTop: 0,
                    } }
                    onChange={ (e, index, value) => {
                      this.props.inputChange(field.name, value, true, this.props.formData.type);
                    } }
                    style={ inputStyle }
                    value={ this.props.formData.other[field.name] }
                  >
                    { field.options.map((option) => {
                      return (
                        <MenuItem
                          key={ option }
                          value={ option }
                          primaryText={ option }
                        />
                      );
                    }) }
                  </SelectField> :
                  <TextField
                    errorText={ this.props.errors.other[field.name] }
                    floatingLabelText={ uppercaseFirst(field.name) }
                    fullWidth={ true }
                    key={ field.name }
                    multiLine={ true }
                    onChange={ (e) => { this.props.inputChange(field.name, e.target.value); } }
                    rows={ 1 }
                    rowsMax={ 2 }
                    style={ inputStyle }
                    value={ this.props.formData.other[field.name] }
                  />
              );
            })
          }
        </div>
        <Dialog
          actions={ this.dialogClose() }
          modal={ false }
          onRequestClose={ this.props.dialog.close }
          open={ this.props.dialog.open }
          title={ this.props.dialog.title }
        >
          { this.props.dialog.text }
        </Dialog>
      </div>
    );
  }
}

CreateScreen.propTypes = {
  dialog: PropTypes.shape({
    close: PropTypes.func,
    open: PropTypes.bool,
    text: PropTypes.string,
    title: PropTypes.string,
  }).isRequired,
  dialogOpen: PropTypes.func.isRequired,
  errors: PropTypes.shape({
    cell: PropTypes.string,
    condition: PropTypes.string,
    description: PropTypes.string,
    name: PropTypes.string,
    other: PropTypes.shape({}),
    species: PropTypes.string,
    type: PropTypes.string,
  }).isRequired,
  formData: PropTypes.shape({
    cell: PropTypes.string,
    condition: PropTypes.string,
    description: PropTypes.string,
    name: PropTypes.string,
    other: PropTypes.shape({}),
    species: PropTypes.string,
    type: PropTypes.string,
  }).isRequired,
  inputChange: PropTypes.func.isRequired,
  inputWidth: PropTypes.number.isRequired,
  muiTheme: PropTypes.shape({
    palette: PropTypes.shape({
      alternateTextColor: PropTypes.string,
      warning: PropTypes.string,
      warningHover: PropTypes.string,
    }),
  }).isRequired,
};

export default muiThemeable()(CreateScreen);
