import MenuItem from 'material-ui/MenuItem';
import PropTypes from 'prop-types';
import React from 'react';
import SelectField from 'material-ui/SelectField';

import analysisStyle from '../analysis-style';
import Fields from '../../modules/fields';

class SelectScreenType extends React.Component {
  highlightMenuItem = (_id, arr1, arr2, level) => {
    return (arr1.includes(_id) && level === 'sample') || arr2.includes(_id) ?
      analysisStyle.menuItemSelected
      :
      {}
    ;
  }
  render() {
    return (
      <div>
        <div
          style={
            this.props.screenSize.isLarge ?
            analysisStyle.helpBoxLarge
            :
            analysisStyle.helpBox
          }
        >
          Choose the type of Screen you would like to analyze. Samples will
          be filtered based on the type of screen selected and
          your user permissions.</div>
        <SelectField
          errorText={ this.props.errors.screenType }
          floatingLabelText="Screen type"
          fullWidth={ true }
          listStyle={ {
            paddingBottom: 0,
            paddingTop: 0,
          } }
          onChange={ (e, index, value) => { this.props.inputChange('screenType', value); } }
          style={ analysisStyle.input }
          value={ this.props.formData.screenType }
        >
          {
            Fields.screen.type.values.map((type) => {
              return (
                <MenuItem
                  key={ type }
                  value={ type }
                  primaryText={ type }
                />
              );
            })
          }
        </SelectField>
      </div>
    );
  }
}

SelectScreenType.propTypes = {
  errors: PropTypes.shape({
    analysisType: PropTypes.string,
    screenType: PropTypes.string,
  }).isRequired,
  formData: PropTypes.shape({
    analysisType: PropTypes.string,
    screenType: PropTypes.string,
  }).isRequired,
  inputChange: PropTypes.func.isRequired,
  screenSize: PropTypes.shape({
    isLarge: PropTypes.bool,
    isSmall: PropTypes.bool,
  }).isRequired,
};

export default SelectScreenType;
