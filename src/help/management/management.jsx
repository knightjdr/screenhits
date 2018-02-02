import PropTypes from 'prop-types';
import React from 'react';

class Management extends React.Component {
  render() {
    return (
      <div>
        {
          this.props.children ||
          <p>
            Management
          </p>
        }
      </div>
    );
  }
}

Management.defaultProps = {
  children: null,
};

Management.propTypes = {
  children: PropTypes.shape({}),
};

export default Management;
