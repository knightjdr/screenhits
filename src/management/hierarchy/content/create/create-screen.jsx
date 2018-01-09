import AutoComplete from 'material-ui/AutoComplete';
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

import createStyle from './create-style';
import Fields from '../../../../modules/fields';
import CellsDataSource from '../../../../assets/data/cells';
import { uppercaseFirst } from '../../../../helpers/helpers';

class CreateScreen extends React.Component {
  autoCompleteFilter = (searchText, key) => {
    return key.toLowerCase().includes(searchText.toLowerCase());
  }
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
  inputChangeCell = (value) => {
    this.props.inputChange('cell', value);
  }
  inputChangeCellMods = (e) => {
    this.props.inputChange('cellMods', e.target.value);
  }
  inputChangeComment = (e) => {
    this.props.inputChange('comment', e.target.value);
  }
  inputChangeCondition = (e) => {
    this.props.inputChange('condition', e.target.value);
  }
  inputChangeDrugs = (e) => {
    this.props.inputChange('drugs', e.target.value);
  }
  inputChangeName = (e) => {
    this.props.inputChange('name', e.target.value);
  }
  inputChangeSpecies = (value) => {
    this.props.downloadDataSource('species', value);
    this.props.inputChange('species', value);
  }
  inputChangeTaxonID = (e) => {
    const value = e.target.value;
    if (!isNaN(value)) {
      this.props.inputChange('taxonID', Number(value));
    }
  }
  inputChangeType = (e, index, value) => {
    this.props.inputChange('type', value);
  }
  render() {
    return (
      <div>
        <div>
          <FontAwesome name="info-circle" /> Name your screen and provide all details below.
        </div>
        <div
          style={ {
            alignItems: 'flex-start',
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
            style={ createStyle.input }
            value={ this.props.formData.name }
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
            style={ createStyle.input }
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
          <div
            style={ Object.assign(
              {},
              createStyle.input,
              {
                width: this.props.inputWidth,
              },
            ) }
          >
            <AutoComplete
              dataSource={ this.props.dataSource.species.map((entry) => { return entry.name; }) }
              filter={ this.autoCompleteFilter }
              floatingLabelText="Species"
              fullWidth={ true }
              maxSearchResults={ 15 }
              multiLine={ false }
              onUpdateInput={ this.inputChangeSpecies }
              searchText={ this.props.formData.species }
            />
          </div>
          <TextField
            errorText={ this.props.errors.taxonID }
            floatingLabelText="Taxon ID"
            fullWidth={ true }
            onChange={ this.inputChangeTaxonID }
            style={ createStyle.input }
            type="number"
            value={ this.props.formData.taxonID || '' }
          />
          <div
            style={ Object.assign(
              {},
              createStyle.input,
              {
                width: this.props.inputWidth,
              },
            ) }
          >
            <AutoComplete
              dataSource={ CellsDataSource }
              errorText={ this.props.errors.cell }
              filter={ this.autoCompleteFilter }
              floatingLabelText="Cell type"
              fullWidth={ true }
              maxSearchResults={ 15 }
              multiLine={ false }
              onUpdateInput={ this.inputChangeCell }
              searchText={ this.props.formData.cell }
            />
          </div>
          <div
            style={ Object.assign(
              {},
              createStyle.inputWithHelp,
              {
                width: this.props.inputWidth,
              },
            ) }
          >
            <TextField
              floatingLabelText="Cell line modifications"
              fullWidth={ true }
              multiLine={ true }
              onChange={ this.inputChangeCellMods }
              rows={ 1 }
              rowsMax={ 2 }
              value={ this.props.formData.cellMods }
            />
            <IconButton
              onTouchTap={ () => {
                this.props.dialog.open(
                  'Help for the "Cell line modifications" field',
                  Fields.screen.cellMods.help
                );
              } }
              tooltip="Help"
              tooltipPosition="top-center"
            >
              <HelpIcon />
            </IconButton>
          </div>
          <div
            style={ Object.assign(
              {},
              createStyle.inputWithHelp,
              {
                width: this.props.inputWidth,
              },
            ) }
          >
            <TextField
              floatingLabelText="Drug treatments"
              fullWidth={ true }
              multiLine={ true }
              onChange={ this.inputChangeDrugs }
              rows={ 1 }
              rowsMax={ 2 }
              value={ this.props.formData.drugs }
            />
            <IconButton
              onTouchTap={ () => {
                this.props.dialog.open(
                  'Help for the "Drug treatments" field',
                  Fields.screen.drugs.help
                );
              } }
              tooltip="Help"
              tooltipPosition="top-center"
            >
              <HelpIcon />
            </IconButton>
          </div>
          <div
            style={ Object.assign(
              {},
              createStyle.inputWithHelp,
              {
                width: this.props.inputWidth,
              },
            ) }
          >
            <TextField
              floatingLabelText="Other conditions"
              fullWidth={ true }
              multiLine={ true }
              onChange={ this.inputChangeCondition }
              rows={ 1 }
              rowsMax={ 2 }
              value={ this.props.formData.condition }
            />
            <IconButton
              onTouchTap={ () => {
                this.props.dialog.open('Help for the "Other conditions" field', Fields.screen.condition.help);
              } }
              tooltip="Help"
              tooltipPosition="top-center"
            >
              <HelpIcon />
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
                    style={ createStyle.input }
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
                    style={ createStyle.input }
                    value={ this.props.formData.other[field.name] }
                  />
              );
            })
          }
          <TextField
            floatingLabelText="Comments (optional)"
            fullWidth={ true }
            multiLine={ true }
            onChange={ this.inputChangeComment }
            rows={ 1 }
            rowsMax={ 5 }
            style={ createStyle.input }
            value={ this.props.formData.comment }
          />
        </div>
        <Dialog
          actions={ this.dialogClose() }
          modal={ false }
          onRequestClose={ this.props.dialog.close }
          open={ this.props.dialog.help }
          title={ this.props.dialog.title }
        >
          { this.props.dialog.text }
        </Dialog>
      </div>
    );
  }
}

CreateScreen.propTypes = {
  dataSource: PropTypes.shape({
    species: PropTypes.array,
  }).isRequired,
  dialog: PropTypes.shape({
    close: PropTypes.func,
    help: PropTypes.bool,
    open: PropTypes.func,
    text: PropTypes.string,
    title: PropTypes.string,
  }).isRequired,
  downloadDataSource: PropTypes.func.isRequired,
  errors: PropTypes.shape({
    cell: PropTypes.string,
    condition: PropTypes.string,
    name: PropTypes.string,
    other: PropTypes.shape({}),
    taxonID: PropTypes.string,
    type: PropTypes.string,
  }).isRequired,
  formData: PropTypes.shape({
    cell: PropTypes.string,
    cellMods: PropTypes.string,
    comment: PropTypes.string,
    condition: PropTypes.string,
    drugs: PropTypes.string,
    name: PropTypes.string,
    other: PropTypes.shape({}),
    species: PropTypes.string,
    taxonID: PropTypes.number,
    type: PropTypes.string,
  }).isRequired,
  inputChange: PropTypes.func.isRequired,
  inputWidth: PropTypes.number.isRequired,
  muiTheme: PropTypes.shape({
    palette: PropTypes.shape({
      warning: PropTypes.string,
      warningHover: PropTypes.string,
    }),
  }).isRequired,
};

export default muiThemeable()(CreateScreen);
