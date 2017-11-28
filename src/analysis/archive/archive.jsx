import muiThemeable from 'material-ui/styles/muiThemeable';
import PropTypes from 'prop-types';
import React from 'react';

import TaskList from './tasklist/task-list-container';
import TaskView from './taskView/task-view-container';

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
        {
          !this.props.viewID ?
            <TaskList
              applyFilters={ this.props.applyFilters }
              clearFilters={ this.props.clearFilters }
              filterFuncs={ this.props.filterFuncs }
              filters={ this.props.filters }
              tasks={ this.props.tasks }
              taskStatus={ this.props.taskStatus }
              updateTasks={ this.props.updateTasks }
            />
            :
            <TaskView
              viewID={ this.props.viewID }
            />
        }
      </div>
    );
  }
}

Archive.defaultProps = {
  user: {
    email: null,
    lab: null,
    name: null,
  },
  viewID: null,
};

Archive.propTypes = {
  applyFilters: PropTypes.func.isRequired,
  clearFilters: PropTypes.func.isRequired,
  filterFuncs: PropTypes.shape({
    analysisType: PropTypes.func,
    screenType: PropTypes.func,
    user: PropTypes.func,
  }).isRequired,
  filters: PropTypes.shape({
    analysisType: PropTypes.string,
    screenType: PropTypes.string,
    user: PropTypes.string,
  }).isRequired,
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
  updateTasks: PropTypes.func.isRequired,
  viewID: PropTypes.number,
};

export default muiThemeable()(Archive);
