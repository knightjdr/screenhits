import FontAwesome from 'react-fontawesome';
import MenuItem from 'material-ui/MenuItem';
import muiThemeable from 'material-ui/styles/muiThemeable';
import PropTypes from 'prop-types';
import TextField from 'material-ui/TextField';
import React from 'react';
import SelectField from 'material-ui/SelectField';

import Fields from './fields';
import SelectInput from './select-input/select-input-container';

const inputStyle = {
  marginLeft: 4,
  marginRight: 4,
  maxWidth: 500,
};

class CreateScreen extends React.Component {
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
        <TextField
          errorText={ this.props.errors.name }
          floatingLabelText="Screen name (short)"
          fullWidth={ true }
          multiLine={ true }
          onChange={ (e) => { this.props.inputChange('name', e.target.value); } }
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
          onChange={ (e) => { this.props.inputChange('description', e.target.value); } }
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
          onChange={ (e, index, value) => { this.props.inputChange('type', value); } }
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
          errorText={ this.props.errors.species }
          inputChange={ this.props.inputChange }
          labelText="Species"
          options={ Fields.screen.species.values }
          type="species"
          value={ this.props.formData.species }
        />
        <SelectInput
          errorText={ this.props.errors.cell }
          inputChange={ this.props.inputChange }
          labelText="Cell type"
          options={ Fields.screen.cell.values }
          type="cell"
          value={ this.props.formData.cell }
        />
        <TextField
          floatingLabelText="Condition"
          fullWidth={ true }
          multiLine={ true }
          onChange={ (e) => { this.props.inputChange('condition', e.target.value); } }
          rows={ 1 }
          rowsMax={ 4 }
          style={ inputStyle }
          value={ this.props.formData.condition }
        />
      </div>
    );
  }
}

CreateScreen.propTypes = {
  errors: PropTypes.shape({
    cell: PropTypes.string,
    condition: PropTypes.string,
    description: PropTypes.string,
    name: PropTypes.string,
    species: PropTypes.string,
    type: PropTypes.string,
  }).isRequired,
  formData: PropTypes.shape({
    cell: PropTypes.string,
    condition: PropTypes.string,
    description: PropTypes.string,
    name: PropTypes.string,
    species: PropTypes.string,
    type: PropTypes.string,
  }).isRequired,
  inputChange: PropTypes.func.isRequired,
  muiTheme: PropTypes.shape({
    palette: PropTypes.shape({
      alternateTextColor: PropTypes.string,
    }),
  }).isRequired,
};

export default muiThemeable()(CreateScreen);
