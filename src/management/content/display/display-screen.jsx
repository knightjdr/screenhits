import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import HelpIcon from 'material-ui/svg-icons/action/help';
import MenuItem from 'material-ui/MenuItem';
import muiThemeable from 'material-ui/styles/muiThemeable';
import PropTypes from 'prop-types';
import React from 'react';
import SelectField from 'material-ui/SelectField';
import TextField from 'material-ui/TextField';

import ActionButtons from '../../../action-buttons/action-buttons-container';
import CellsDataSource from '../../../assets/data/cells';
import FieldsScreen from '../create/forms/fields-screen';
import SelectInput from '../create/select-input/select-input-container';
import SpeciesDataSource from '../../../assets/data/species';
import { objectEmpty, uppercaseFirst } from '../../../helpers/helpers';

const actionButtonStyle = {
  float: 'right',
  margin: '10px 10px 0px 0px',
};

const deleteContainer = {
  height: 40,
  width: '100%',
};

const Fields = {
  screen: FieldsScreen,
};

const elementContainerStyle = {
  alignItems: 'top',
  display: 'flex',
  margin: '5px 0px 5px 0px',
};
const elementKeyStyle = {
  borderRadius: 2,
  minWidth: 120,
  textAlign: 'right',
  padding: '5px 5px 5px 5px',
  width: 120,
};
const elementValueStyle = {
  marginLeft: 10,
  padding: '5px 5px 5px 5px',
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
  display: 'inline-flex',
  marginLeft: 4,
  marginRight: 4,
};

class DisplayScreen extends React.Component {
  confirmDeletion = () => {
    return (
    [
      <FlatButton
        backgroundColor={ this.props.muiTheme.palette.success }
        hoverColor={ this.props.muiTheme.palette.successHover }
        label="Confirm"
        onTouchTap={ () => { this.props.deleteScreen(this.props.screen._id); } }
      />,
    ]);
  }
  dialogClose = () => {
    return (
    [
      <FlatButton
        backgroundColor={ this.props.muiTheme.palette.warning }
        hoverColor={ this.props.muiTheme.palette.warningHover }
        label="Close"
        onTouchTap={ this.props.dialog.close }
        style={ {
          marginLeft: 10,
        } }
      />,
    ]);
  }
  render() {
    return (
      <div>
        { !this.props.edit ?
          <div
            style={ elementContainerStyle }
          >
            <div
              style={ Object.assign(
                {},
                elementKeyStyle,
                {
                  backgroundColor: this.props.muiTheme.palette.keyColor,
                  border: `1px solid ${this.props.muiTheme.palette.keyColorBorder}`,
                },
              ) }
            >
              <span>
                Name:
              </span>
            </div>
            <div
              style={ elementValueStyle }
            >
              { this.props.screen.name }
            </div>
          </div>
          :
          <TextField
            errorText={ this.props.errors.name }
            floatingLabelText="Screen name (short)"
            fullWidth={ true }
            multiLine={ true }
            onChange={ (e) => { this.props.inputChange('name', e.target.value); } }
            rows={ 1 }
            rowsMax={ 2 }
            style={ inputStyle }
            value={ this.props.screen.name }
          />
        }
        { !this.props.edit ?
          <div
            style={ elementContainerStyle }
          >
            <div
              style={ Object.assign(
                {},
                elementKeyStyle,
                {
                  backgroundColor: this.props.muiTheme.palette.keyColor,
                  border: `1px solid ${this.props.muiTheme.palette.keyColorBorder}`,
                },
              ) }
            >
              <span>
                Description:
              </span>
            </div>
            <div
              style={ elementValueStyle }
            >
              { this.props.screen.description }
            </div>
          </div>
          :
          <TextField
            errorText={ this.props.errors.description }
            floatingLabelText="Screen description"
            fullWidth={ true }
            multiLine={ true }
            onChange={ (e) => { this.props.inputChange('description', e.target.value); } }
            rows={ 1 }
            rowsMax={ 2 }
            style={ inputStyle }
            value={ this.props.screen.description }
          />
        }
        { !this.props.edit ?
          <div
            style={ elementContainerStyle }
          >
            <div
              style={ Object.assign(
                {},
                elementKeyStyle,
                {
                  backgroundColor: this.props.muiTheme.palette.keyColor,
                  border: `1px solid ${this.props.muiTheme.palette.keyColorBorder}`,
                },
              ) }
            >
              <span>
                Screen type:
              </span>
            </div>
            <div
              style={ elementValueStyle }
            >
              { this.props.screen.type }
            </div>
          </div>
          :
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
            value={ this.props.screen.type }
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
        }
        { !this.props.edit ?
          <div
            style={ elementContainerStyle }
          >
            <div
              style={ Object.assign(
                {},
                elementKeyStyle,
                {
                  backgroundColor: this.props.muiTheme.palette.keyColor,
                  border: `1px solid ${this.props.muiTheme.palette.keyColorBorder}`,
                },
              ) }
            >
              <span>
                Species:
              </span>
            </div>
            <div
              style={ elementValueStyle }
            >
              { this.props.screen.species }
            </div>
          </div>
          :
          <SelectInput
            dataSource={ SpeciesDataSource }
            errorText={ this.props.errors.species }
            inputChange={ this.props.inputChange }
            inputWidth={ this.props.inputWidth }
            labelText="Species"
            options={ Fields.screen.species.values }
            type="species"
            value={ this.props.screen.species }
          />
        }
        { !this.props.edit ?
          <div
            style={ elementContainerStyle }
          >
            <div
              style={ Object.assign(
                {},
                elementKeyStyle,
                {
                  backgroundColor: this.props.muiTheme.palette.keyColor,
                  border: `1px solid ${this.props.muiTheme.palette.keyColorBorder}`,
                },
              ) }
            >
              <span>
                Cell type:
              </span>
            </div>
            <div
              style={ elementValueStyle }
            >
              { this.props.screen.cell }
            </div>
          </div>
          :
          <SelectInput
            dataSource={ CellsDataSource }
            errorText={ this.props.errors.cell }
            inputChange={ this.props.inputChange }
            inputWidth={ this.props.inputWidth }
            labelText="Cell type"
            options={ Fields.screen.cell.values }
            type="cell"
            value={ this.props.screen.cell }
          />
        }
        { !this.props.edit ?
          <div
            style={ Object.assign(
              {},
              elementContainerStyle,
              {
                display: this.props.screen.condition ? 'flex' : 'none',
              },
            ) }
          >
            <div
              style={ Object.assign(
                {},
                elementKeyStyle,
                {
                  backgroundColor: this.props.muiTheme.palette.keyColor,
                  border: `1px solid ${this.props.muiTheme.palette.keyColorBorder}`,
                },
              ) }
            >
              <span>
                Condition:
              </span>
            </div>
            <div
              style={ elementValueStyle }
            >
              { this.props.screen.condition }
            </div>
          </div>
          :
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
              onChange={ (e) => { this.props.inputChange('condition', e.target.value); } }
              rows={ 1 }
              rowsMax={ 2 }
              style={ inputStyle }
              value={ this.props.screen.condition }
            />
            <IconButton
              onTouchTap={ () => {
                this.props.dialog.open('help', 'Help for the "Condition" field', Fields.screen.condition.help);
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
        }
        { !this.props.edit ? (
            this.props.screen.other &&
            !objectEmpty(this.props.screen.other) &&
            Object.keys(this.props.screen.other).sort().map((key) => {
              return (
                <div
                  key={ `${key}-container` }
                  style={ elementContainerStyle }
                >
                  <div
                    key={ `${key}-header` }
                    style={ Object.assign(
                      {},
                      elementKeyStyle,
                      {
                        backgroundColor: this.props.muiTheme.palette.keyColor,
                        border: `1px solid ${this.props.muiTheme.palette.keyColorBorder}`,
                      },
                    ) }
                  >
                    <span
                      key={ `${key}-span` }
                    >
                      { uppercaseFirst(key) }:
                    </span>
                  </div>
                  <div
                    key={ `${key}-value` }
                    style={ elementValueStyle }
                  >
                    { this.props.screen.other[key] }
                  </div>
                </div>
              );
            })
          ) :
            (
              Fields.screen.other[this.props.screen.type].map((field) => {
                return (
                  field.type === 'select' ?
                    <SelectField
                      errorText={ field.defaultError }
                      floatingLabelText={ uppercaseFirst(field.name) }
                      fullWidth={ true }
                      key={ field.name }
                      listStyle={ {
                        paddingBottom: 0,
                        paddingTop: 0,
                      } }
                      onChange={ (e, index, value) => {
                        this.props.inputChange(field.name, value, true, this.props.screen.type);
                      } }
                      style={ inputStyle }
                      value={ this.props.screen.other[field.name] }
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
                      errorText={ field.defaultError }
                      floatingLabelText={ uppercaseFirst(field.name) }
                      fullWidth={ true }
                      key={ field.name }
                      multiLine={ true }
                      onChange={ (e) => { this.props.inputChange(field.name, e.target.value); } }
                      rows={ 1 }
                      rowsMax={ 2 }
                      style={ inputStyle }
                      value={ this.props.screen.other[field.name] }
                    />
                );
              })
            )
        }
        { !this.props.edit ?
          this.props.screen.comment &&
          <div
            style={ elementContainerStyle }
          >
            <div
              style={ Object.assign(
                {},
                elementKeyStyle,
                {
                  backgroundColor: this.props.muiTheme.palette.keyColor,
                  border: `1px solid ${this.props.muiTheme.palette.keyColorBorder}`,
                },
              ) }
            >
              <span>
                Comments:
              </span>
            </div>
            <div
              style={ elementValueStyle }
            >
              { this.props.screen.comment }
            </div>
          </div>
          :
          <TextField
            floatingLabelText="Comments (optional)"
            fullWidth={ true }
            multiLine={ true }
            onChange={ (e) => { this.props.inputChange('comment', e.target.value); } }
            rows={ 1 }
            rowsMax={ 5 }
            style={ inputStyle }
            value={ this.props.screen.comment }
          />
        }
        { !this.props.edit &&
          <div
            style={ elementContainerStyle }
          >
            <div
              style={ Object.assign(
                {},
                elementKeyStyle,
                {
                  backgroundColor: this.props.muiTheme.palette.keyColor,
                  border: `1px solid ${this.props.muiTheme.palette.keyColorBorder}`,
                },
              ) }
            >
              <span>
                Creator:
              </span>
            </div>
            <div
              style={ elementValueStyle }
            >
              { this.props.screen.creatorName }
            </div>
          </div>
        }
        { !this.props.edit &&
          <div
            style={ elementContainerStyle }
          >
            <div
              style={ Object.assign(
                {},
                elementKeyStyle,
                {
                  backgroundColor: this.props.muiTheme.palette.keyColor,
                  border: `1px solid ${this.props.muiTheme.palette.keyColorBorder}`,
                },
              ) }
            >
              <span>
                Creation Date:
              </span>
            </div>
            <div
              style={ elementValueStyle }
            >
              { this.props.screen.creationDate}
            </div>
          </div>
        }
        {
          !this.props.edit &&
          <div
            style={ deleteContainer }
          >
            <div
              style={ actionButtonStyle }
            >
              <ActionButtons
                cancel={ {
                  func: () => { this.props.dialog.open('delete'); },
                  label: 'Delete',
                  toolTipText: 'Delete screen',
                } }
                idSuffix="delete-screen"
              />
            </div>
          </div>
        }
        <Dialog
          actions={ [
            this.confirmDeletion(),
            this.dialogClose(),
          ] }
          modal={ false }
          onRequestClose={ this.props.dialog.close }
          open={ this.props.dialog.delete }
          title="Confirmation"
        >
          This action will permanently delete the screen (and all experiments,
          samples and analysis associated with it). Press confirm to proceed.
        </Dialog>
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

DisplayScreen.propTypes = {
  deleteScreen: PropTypes.func.isRequired,
  dialog: PropTypes.shape({
    close: PropTypes.func,
    delete: PropTypes.bool,
    help: PropTypes.bool,
    open: PropTypes.func,
    text: PropTypes.string,
    title: PropTypes.string,
  }).isRequired,
  edit: PropTypes.bool.isRequired,
  errors: PropTypes.shape({
    cell: PropTypes.string,
    description: PropTypes.string,
    name: PropTypes.string,
    other: PropTypes.shape({}),
    species: PropTypes.string,
    type: PropTypes.string,
  }).isRequired,
  inputChange: PropTypes.func.isRequired,
  inputWidth: PropTypes.number.isRequired,
  screen: PropTypes.shape({
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
  muiTheme: PropTypes.shape({
    palette: PropTypes.shape({
      alternateTextColor: PropTypes.string,
      keyColor: PropTypes.string,
      keyColorBorder: PropTypes.string,
      success: PropTypes.string,
      successHover: PropTypes.string,
      warning: PropTypes.string,
      warningHover: PropTypes.string,
    }),
  }).isRequired,
};

export default muiThemeable()(DisplayScreen);
