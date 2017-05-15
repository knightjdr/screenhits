import Checkbox from 'material-ui/Checkbox';
import MenuItem from 'material-ui/MenuItem';
import PropTypes from 'prop-types';
import TextField from 'material-ui/TextField';
import React from 'react';
import SelectField from 'material-ui/SelectField';

class SelectInput extends React.Component {
  render() {
    return (
      <div
        style={ {
          display: 'flex',
          marginLeft: 4,
          marginRight: 4,
          maxWidth: 500,
        } }
      >
        { this.props.inputType === 'text' ?
          <TextField
            errorText={ this.props.errorText }
            floatingLabelText={ this.props.labelText }
            fullWidth={ true }
            multiLine={ true }
            onChange={ (e) => { this.props.inputChange(this.props.type, e.target.value); } }
            rows={ 1 }
            rowsMax={ 2 }
            value={ this.props.value }
          /> :
          <SelectField
            errorText={ this.props.errorText }
            floatingLabelText={ this.props.labelText }
            fullWidth={ true }
            listStyle={ {
              paddingBottom: 0,
              paddingTop: 0,
            } }
            onChange={ (e, index, value) => { this.props.inputChange(this.props.type, value); } }
            value={ this.props.value }
          >
            { this.props.options.map((type) => {
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
        <Checkbox
          label="Free text"
          onCheck={ () => { this.props.changeType(); } }
          style={ {
            marginLeft: 5,
            marginTop: 40,
            width: 125,
          } }
        />
      </div>
    );
  }
}

SelectInput.defaultProps = {
  errorText: null,
  value: '',
};

SelectInput.propTypes = {
  changeType: PropTypes.func.isRequired,
  errorText: PropTypes.string,
  inputType: PropTypes.string.isRequired,
  inputChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.string,
  ).isRequired,
  labelText: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  value: PropTypes.string,
};

export default SelectInput;
