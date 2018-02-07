import PropTypes from 'prop-types';
import React from 'react';

class Analysis extends React.Component {
  render() {
    return (
      <div>
        {
          this.props.children ||
          <div>
            Analysis
          </div>
        }
      </div>
    );
  }
}

Analysis.defaultProps = {
  children: null,
};

Analysis.propTypes = {
  children: PropTypes.shape({}),
};

export default Analysis;
