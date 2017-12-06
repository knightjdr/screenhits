import deepEqual from 'deep-equal';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import Archive from './archive';
import getAnalysisTasks from '../../state/get/analysis-task-actions';

const defaultFilters = {
  analysisType: null,
  screenType: null,
};

class ArchiveContainer extends React.Component {
  constructor(props) {
    super(props);
    const filters = Object.assign(
      {},
      defaultFilters,
      {
        user: this.props.user.name,
      }
    );
    this.state = {
      filters,
      tasks: this.filterTasks(this.props.tasks.items, filters),
      taskStatus: {
        didInvalidate: false,
        fetching: true,
        message: '',
      },
    };
  }
  componentDidMount = () => {
    this.props.getAnalysisTasks(this.props.user);
  }
  componentWillReceiveProps = (nextProps) => {
    const { tasks } = nextProps;
    if (!deepEqual(tasks, this.props.tasks)) {
      this.setState(({ filters }) => {
        return {
          tasks: this.filterTasks(tasks.items, filters),
          taskStatus: {
            didInvalidate: tasks.didInvalidate,
            fetching: tasks.fetching,
            message: tasks.message,
          },
        };
      });
    }
  }
  applyFilters = () => {
    this.setState(({ filters }) => {
      return {
        tasks: this.filterTasks(this.props.tasks.items, filters),
      };
    });
  }
  clearFilters = () => {
    const filters = Object.assign(
      {},
      defaultFilters,
      {
        user: '',
      }
    );
    this.setState({
      filters,
      tasks: this.filterTasks(this.props.tasks.items, filters),
    });
  }
  filterAnalysisType = (e, index, value) => {
    const analysisType = value !== 'none' ? value : null;
    this.setState(({ filters }) => {
      return {
        filters: Object.assign(
          {},
          filters,
          {
            analysisType,
          },
        ),
      };
    });
  }
  filterScreenType = (e, index, value) => {
    const screenType = value !== 'none' ? value : null;
    this.setState(({ filters }) => {
      return {
        filters: Object.assign(
          {},
          filters,
          {
            analysisType: null,
            screenType,
          },
        ),
      };
    });
  }
  filterTasks = (tasks, filters) => {
    return tasks.filter((task) => {
      const userRE = new RegExp(filters.user);
      if (
        filters.user &&
        !userRE.test(task.user)
      ) {
        return false;
      } else if (
        filters.screenType &&
        task.details.screenType !== filters.screenType
      ) {
        return false;
      } else if (
        filters.analysisType &&
        task.details.analysisType !== filters.analysisType
      ) {
        return false;
      }
      return true;
    });
  }
  filterUser = (e) => {
    const user = e.target.value;
    this.setState(({ filters }) => {
      return {
        filters: Object.assign(
          {},
          filters,
          {
            user,
          },
        ),
      };
    });
  }
  updateTasks = () => {
    this.props.getAnalysisTasks(this.props.user);
  }
  render() {
    return (
      <Archive
        applyFilters={ this.applyFilters }
        clearFilters={ this.clearFilters }
        filterFuncs={ {
          analysisType: this.filterAnalysisType,
          screenType: this.filterScreenType,
          user: this.filterUser,
        } }
        filters={ this.state.filters }
        tasks={ this.state.tasks }
        taskStatus={ this.state.taskStatus }
        updateTasks={ this.updateTasks }
        viewID={ this.props.viewID }
      />
    );
  }
}

ArchiveContainer.defaultProps = {
  user: {
    email: '',
    lab: '',
    name: '',
  },
  viewID: null,
};

ArchiveContainer.propTypes = {
  getAnalysisTasks: PropTypes.func.isRequired,
  tasks: PropTypes.shape({
    didInvalidate: PropTypes.bool,
    isFetching: PropTypes.bool,
    items: PropTypes.arrayOf(
      PropTypes.shape({})
    ),
    message: PropTypes.string,
  }).isRequired,
  user: PropTypes.shape({
    email: PropTypes.string,
    lab: PropTypes.string,
    name: PropTypes.string,
  }),
  viewID: PropTypes.number,
};

const mapDispatchToProps = (dispatch) => {
  return {
    getAnalysisTasks: (user) => {
      dispatch(getAnalysisTasks(user));
    },
  };
};

const mapStateToProps = (state) => {
  return {
    tasks: state.tasks,
    user: state.user,
  };
};

const Container = connect(
  mapStateToProps,
  mapDispatchToProps,
)(ArchiveContainer);

export default Container;
