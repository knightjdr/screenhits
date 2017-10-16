import AutoComplete from 'material-ui/AutoComplete';
import Checkbox from 'material-ui/Checkbox';
import MenuItem from 'material-ui/MenuItem';
import PropTypes from 'prop-types';
import React from 'react';
import SelectField from 'material-ui/SelectField';

import RadioButtonChecked from 'material-ui/svg-icons/toggle/radio-button-checked';
import RadioButtonUnchecked from 'material-ui/svg-icons/toggle/radio-button-unchecked';

class SelectInput extends React.Component {
  autoCompleteFilter = (searchText, key) => {
    return key.toLowerCase().includes(searchText.toLowerCase());
  }
  inputChangeText = (value) => {
    this.props.inputChange(this.props.type, value);
  }
  inputChangeSelect = (e, index, value) => {
    this.props.inputChange(this.props.type, value);
  }
  render() {
    return (
      <div
        style={ {
          display: 'inline-flex',
          marginLeft: 4,
          marginRight: 4,
          verticalAlign: 'top',
          width: this.props.inputWidth,
        } }
      >
        { this.props.inputType === 'text' ?
          <AutoComplete
            dataSource={ this.props.dataSource }
            errorText={ this.props.errorText }
            filter={ this.autoCompleteFilter }
            floatingLabelText={ this.props.labelText }
            fullWidth={ true }
            maxSearchResults={ 20 }
            multiLine={ true }
            onUpdateInput={ this.inputChangeText }
            rows={ 1 }
            rowsMax={ 2 }
            searchText={ this.props.value }
          /> :
          <SelectField
            errorText={ this.props.errorText }
            floatingLabelText={ this.props.labelText }
            fullWidth={ true }
            listStyle={ {
              paddingBottom: 0,
              paddingTop: 0,
            } }
            onChange={ this.inputChangeSelect }
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
          checked={ this.props.inputType === 'text' }
          checkedIcon={ <RadioButtonChecked /> }
          iconStyle={ {
            marginRight: 5,
          } }
          label="Free text"
          onCheck={ this.props.changeType }
          style={ {
            marginLeft: 10,
            marginTop: 40,
            width: 150,
          } }
          uncheckedIcon={
            <RadioButtonUnchecked />
          }
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
  dataSource: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
    ]),
  ).isRequired,
  errorText: PropTypes.string,
  inputChange: PropTypes.func.isRequired,
  inputType: PropTypes.string.isRequired,
  inputWidth: PropTypes.number.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.string,
  ).isRequired,
  labelText: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  value: PropTypes.string,
};

export default SelectInput;
