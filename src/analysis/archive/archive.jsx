import muiThemeable from 'material-ui/styles/muiThemeable';
import PropTypes from 'prop-types';
import React from 'react';

import TaskList from './tasklist/task-list-container';

class Archive extends React.Component {
  render() {
    return (
      <div
        style={ {
          color: this.props.muiTheme.palette.textColor,
          overflowY: 'hidden',
          padding: '5px 0px 10px 0px',
        } }
      >
        <TaskList
          tasks={ this.props.tasks }
        />
      </div>
    );
  }
}

Archive.propTypes = {
  muiTheme: PropTypes.shape({
    palette: PropTypes.shape({
      textColor: PropTypes.string,
    }),
  }).isRequired,
  tasks: PropTypes.arrayOf(
    PropTypes.shape({}),
  ).isRequired,
};

export default muiThemeable()(Archive);
