import MenuItem from 'material-ui/MenuItem';
import muiThemeable from 'material-ui/styles/muiThemeable';
import PropTypes from 'prop-types';
import React from 'react';
import SelectField from 'material-ui/SelectField';
import TextField from 'material-ui/TextField';

import CellsDataSource from '../../../assets/data/cells';
import FieldsScreen from '../create/forms/fields-screen';
import SelectInput from '../create/select-input/select-input-container';
import SpeciesDataSource from '../../../assets/data/species';
import { objectEmpty, uppercaseFirst } from '../../../helpers/helpers';

const Fields = {
  screen: FieldsScreen,
};

const elementContainerStyle = {
  alignItems: 'center',
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
};
const inputStyle = {
  marginLeft: 4,
  marginRight: 4,
  maxWidth: 500,
};

class DisplayScreen extends React.Component {
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
                Screen name:
              </span>
            </div>
            <div
              style={ elementValueStyle }
            >
              { this.props.item.name }
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
            value={ this.props.item.name }
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
              { this.props.item.description }
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
            value={ this.props.item.description }
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
              { this.props.item.type }
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
            value={ this.props.item.type }
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
              { this.props.item.species }
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
            value={ this.props.item.species }
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
              { this.props.item.cell }
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
            value={ this.props.item.cell }
          />
        }
        { !this.props.edit ?
          <div
            style={ Object.assign(
              {},
              elementContainerStyle,
              {
                display: this.props.item.condition ? 'flex' : 'none',
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
              { this.props.item.condition }
            </div>
          </div>
          :
          <TextField
            floatingLabelText="Condition (optional)"
            fullWidth={ true }
            multiLine={ true }
            onChange={ (e) => { this.props.inputChange('condition', e.target.value); } }
            rows={ 1 }
            rowsMax={ 2 }
            style={ inputStyle }
            value={ this.props.item.condition }
          />
        }
        { !this.props.edit ? (
            this.props.item.other &&
            !objectEmpty(this.props.item.other) &&
            Object.keys(this.props.item.other).sort().map((key) => {
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
                    { this.props.item.other[key] }
                  </div>
                </div>
              );
            })
          ) :
            (
              Fields.screen.other[this.props.item.type].map((field) => {
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
                        this.props.inputChange(field.name, value, true, this.props.item.type);
                      } }
                      style={ inputStyle }
                      value={ this.props.item.other[field.name] }
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
                      value={ this.props.item.other[field.name] }
                    />
                );
              })
            )
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
              { this.props.item['creator-name'] }
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
              { this.props.item['creation-date']}
            </div>
          </div>
        }
      </div>
    );
  }
}

DisplayScreen.propTypes = {
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
  item: PropTypes.shape({
    _id: PropTypes.number,
    cell: PropTypes.string,
    condition: PropTypes.string,
    'creator-email': PropTypes.string,
    'creator-name': PropTypes.string,
    description: PropTypes.string,
    name: PropTypes.string,
    other: PropTypes.shape({}),
    species: PropTypes.string,
    type: PropTypes.string,
    'creation-date': PropTypes.string,
    'update-date': PropTypes.string,
  }).isRequired,
  muiTheme: PropTypes.shape({
    palette: PropTypes.shape({
      keyColor: PropTypes.string,
      keyColorBorder: PropTypes.string,
    }),
  }).isRequired,
};

export default muiThemeable()(DisplayScreen);
