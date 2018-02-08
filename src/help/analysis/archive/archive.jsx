import PropTypes from 'prop-types';
import React from 'react';

class Archive extends React.Component {
  render() {
    return (
      <div>
        {
          this.props.children ||
          <div>
            <p>
              The analysis archive is where completed and queued analysis results
              can be found. Right now users are restricted to viewing analysis
              created by themselves or their lab (site administators can view
              anything). Finer controls for permissions will be added in the future
              to allow users to share results between labs or specific users.
            </p>
          </div>
        }
      </div>
    );
  }
}

Archive.defaultProps = {
  children: null,
};

Archive.propTypes = {
  children: PropTypes.shape({}),
};

export default Archive;
