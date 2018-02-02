import PropTypes from 'prop-types';
import React from 'react';

class Hierarchical extends React.Component {
  render() {
    return (
      <div>
        <p>
          Hierarchical
        </p>
      </div>
    );
  }
}

Hierarchical.defaultProps = {
  children: null,
};

Hierarchical.propTypes = {
  children: PropTypes.shape({}),
};

export default Hierarchical;
