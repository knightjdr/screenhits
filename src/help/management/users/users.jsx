import PropTypes from 'prop-types';
import React from 'react';

class Users extends React.Component {
  render() {
    return (
      <div>
        {
          this.props.children ||
          <div>
            <p>
              Users.
            </p>
          </div>
        }
      </div>
    );
  }
}

Users.defaultProps = {
  children: null,
};

Users.propTypes = {
  children: PropTypes.shape({}),
};


export default Users;
