import PropTypes from 'prop-types';
import React from 'react';

import SelectInput from './select-input';

class SelectInputContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inputType: 'select',
    };
  }
  changeType = () => {
    this.setState((prevState) => {
      return {
        inputType: prevState.inputType === 'select' ? 'text' : 'select',
      };
    });
  }
  render() {
    return (
      <SelectInput
        changeType={ this.changeType }
        errorText={ this.props.errorText }
        inputType={ this.state.inputType }
        inputChange={ this.props.inputChange }
        inputWidth={ this.props.inputWidth }
        options={ this.props.options }
        labelText={ this.props.labelText }
        type={ this.props.type }
        value={ this.props.value }
      />
    );
  }
}

SelectInputContainer.defaultProps = {
  errorText: null,
  value: '',
};

SelectInputContainer.propTypes = {
  errorText: PropTypes.string,
  inputChange: PropTypes.func.isRequired,
  inputWidth: PropTypes.number.isRequired,
  labelText: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.string,
  ).isRequired,
  type: PropTypes.string.isRequired,
  value: PropTypes.string,
};

export default SelectInputContainer;
