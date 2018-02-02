import PropTypes from 'prop-types';
import React from 'react';

class List extends React.Component {
  render() {
    return (
      <div>
        <p>
          List
        </p>
      </div>
    );
  }
}

List.defaultProps = {
  children: null,
};

List.propTypes = {
  children: PropTypes.shape({}),
};

export default List;
