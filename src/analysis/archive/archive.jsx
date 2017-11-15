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
          taskStatus={ this.props.taskStatus }
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
  taskStatus: PropTypes.shape({
    didInvalidate: PropTypes.bool,
    fetching: PropTypes.bool,
    message: PropTypes.string,
  }).isRequired,
};

export default muiThemeable()(Archive);
