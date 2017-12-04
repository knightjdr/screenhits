import deepEqual from 'deep-equal';
import PropTypes from 'prop-types';
import React from 'react';

import Comparison from './comparison';
import { viewTaskStoreProp } from '../../types';

class ComparisonContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      comparisonStatus: {
        didInvalidate: this.props.comparisonState.didSubmitFail,
        isFetching: this.props.comparisonState.isSubmitted,
        message: this.props.comparisonState.message,
      },
      item: this.props.comparisonState.item,
    };
  }
  componentWillReceiveProps = (nextProps) => {
    const { comparisonState } = nextProps;
    if (!deepEqual(comparisonState, this.props.comparisonState)) {
      this.setState({
        comparisonStatus: {
          didInvalidate: comparisonState.didSubmitFail,
          isFetching: comparisonState.isSubmitted,
          message: comparisonState.message,
        },
        item: JSON.parse(JSON.stringify(comparisonState.item)),
      });
    }
  }
  render() {
    return (
      <Comparison
        comparisonStatus={ this.state.comparisonStatus }
        item={ this.state.item }
      />
    );
  }
}

ComparisonContainer.defaultProps = {
  comparisonState: {
    didSubmitFail: false,
    isSubmitted: false,
    message: '',
    item: {
      header: [],
      legend: {},
      range: {
        max: 0,
        min: 0,
      },
      results: [],
    },
  },
};

ComparisonContainer.propTypes = {
  comparisonState: PropTypes.shape({
    didSubmitFail: PropTypes.bool,
    isSubmitted: PropTypes.bool,
    item: viewTaskStoreProp,
    message: PropTypes.string,
  }),
};

export default ComparisonContainer;
