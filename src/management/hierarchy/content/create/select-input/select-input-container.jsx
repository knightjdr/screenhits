import PropTypes from 'prop-types';
import React from 'react';

import SelectInput from './select-input';

class SelectInputContainer extends React.Component {
  constructor(props) {
    super(props);
    const index = this.props.options.indexOf(this.props.value);
    this.state = {
      inputType: !this.props.value || index >= 0 ? 'select' : 'text',
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
        dataSource={ this.props.dataSource }
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
  dataSource: [],
  errorText: null,
  value: '',
};

SelectInputContainer.propTypes = {
  dataSource: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
    ]),
  ),
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
