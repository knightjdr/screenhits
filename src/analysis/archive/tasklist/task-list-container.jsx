import deepEqual from 'deep-equal';
import Moment from 'moment';
import PropTypes from 'prop-types';
import React from 'react';
import { browserHistory } from 'react-router';
import { connect } from 'react-redux';

import AnalysisModule from '../../../modules/analysis-new';
import DeleteTask from './delete-task';
import Download from '../../../helpers/download';
import Permissions from '../../../helpers/permissions';
import TaskList from './task-list';
import { userProp } from '../../../types/index';

const emptyRect = {
  bottom: null,
  height: null,
  left: null,
  right: null,
  top: null,
  width: null,
  x: null,
  y: null,
};
const defaultTooltip = {
  _id: null,
  position: 'right',
  rect: emptyRect,
  show: false,
  text: '',
};
const tableHeader = [
  {
    name: 'Task ID',
    sort: true,
    type: '_id',
  },
  {
    name: 'Name',
    sort: true,
    type: 'name',
  },
  {
    name: 'User',
    sort: true,
    type: 'user',
  },
  {
    name: 'Date',
    sort: true,
    type: 'date',
  },
  {
    name: 'Step/Status',
    sort: true,
    type: 'status',
  },
  {
    name: 'Options',
    sort: false,
    type: 'options',
  },
];

class TaskListContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      canEdit: Permissions.canEditTask(this.props.user, this.props.tasks),
      deleteDialog: {
        _id: null,
        show: false,
      },
      designDialog: {
        design: [],
        params: [],
        show: false,
        title: '',
      },
      errorDialog: {
        show: false,
        text: '',
        title: '',
      },
      filterDialog: {
        show: false,
      },
      header: tableHeader,
      logDialog: {
        show: false,
        text: '',
        title: '',
      },
      snackbar: {
        duration: 4000,
        last: null,
        message: '',
        open: false,
      },
      tableHeight: this.getHeight(this.props.tasks),
      tasks: this.sortTasks(this.props.tasks, 'date', 'desc'),
      tooltip: defaultTooltip,
    };
  }
  componentDidMount = () => {
    window.addEventListener('resize', this.resize);
  }
  componentWillReceiveProps = (nextProps) => {
    const { tasks, user } = nextProps;
    if (!deepEqual(tasks, this.props.tasks)) {
      this.setState({
        canEdit: Permissions.canEditTask(user, tasks),
        tasks: this.sortTasks(tasks, 'date', 'desc'),
        tableHeight: this.getHeight(tasks),
      });
    }
  }
  componentWillUnmount = () => {
    window.removeEventListener('resize', this.resize);
  }
  getHeight = (table) => {
    // 255 = 185 to top of table, 20 for bottom padding, 50 for footer
    const maxHeightRows = window.innerHeight - 255;
    const neededHeightRows = (table.length * 50);
    let rowHeight = neededHeightRows < maxHeightRows ? neededHeightRows : maxHeightRows;
    // must give space for at least one row
    if (rowHeight < 50) {
      rowHeight = 50;
    }
    return rowHeight + 111;
  }
  closeSnackbar = () => {
    this.setState(({ snackbar }) => {
      return {
        snackbar: Object.assign(
          {},
          snackbar,
          {
            message: '',
            open: false,
          }
        ),
      };
    });
  }
  deleteTask = (_id) => {
    this.hideDeleteDialog();
    this.updateSnackbar({
      isDeleting: true,
    });
    DeleteTask(_id, this.props.token)
      .then((message) => {
        this.updateSnackbar({
          didDeleteFail: false,
          isDeleting: false,
          message,
        });
        this.props.updateTasks();
      })
      .catch((error) => {
        this.updateSnackbar({
          didDeleteFail: true,
          isDeleting: false,
          message: error,
        });
      })
    ;
  }
  downloadTask = (_id) => {
    const queryString = 'format=tsv';
    Download(
      `task_${_id}`,
      'tsv',
      queryString,
      `analysis/tasks/${_id}`,
      this.props.token
    )
      .catch((error) => {
        this.setState({
          errorDialog: {
            show: true,
            text: error.text,
            title: error.title,
          },
        });
      })
    ;
  }
  hideIconTooltip = () => {
    this.setState({
      tooltip: defaultTooltip,
    });
  }
  hideDeleteDialog = () => {
    this.setState({
      deleteDialog: {
        _id: null,
        show: false,
      },
    });
  }
  hideDesignDialog = () => {
    this.setState({
      designDialog: {
        design: [],
        params: [],
        show: false,
        title: '',
      },
    });
  }
  hideFilterDialog = () => {
    this.setState({
      filterDialog: {
        show: false,
      },
    });
  }
  hideErrorDialog = () => {
    this.setState({
      errorDialog: {
        show: false,
        text: '',
        title: '',
      },
    });
  }
  hideLogDialog = () => {
    this.setState({
      logDialog: {
        show: false,
        text: '',
        title: '',
      },
    });
  }
  resize = () => {
    this.setState(({ tasks }) => {
      return {
        tableHeight: this.getHeight(tasks),
      };
    });
  }
  showIconTooltip = (e, text, position = 'top') => {
    const domRect = e.target.getBoundingClientRect();
    const rect = {
      bottom: domRect.bottom,
      height: domRect.height,
      left: domRect.left,
      right: domRect.right,
      top: domRect.top,
      width: domRect.width,
      x: domRect.x,
      y: domRect.y,
    };
    this.setState({
      tooltip: {
        position,
        rect,
        show: true,
        text,
      },
    });
  }
  showDeleteDialog = (_id) => {
    this.setState({
      deleteDialog: {
        _id,
        show: true,
      },
    });
  }
  showDesignDialog = (task) => {
    const fields = AnalysisModule[task.details.screenType][task.details.analysisType].parameters;
    let params = [
      {
        name: 'Screen type',
        value: task.details.screenType,
      },
      {
        name: 'Analysis type',
        value: task.details.analysisType,
      },
    ];
    params = params.concat(fields.map((field) => {
      const taskValue = task.details[field.name] ? String(task.details[field.name]) : null;
      return {
        name: field.layName,
        value: taskValue || task.defaultValue,
      };
    }));
    params._id = task._id;
    this.setState({
      designDialog: {
        design: task.details.design,
        params,
        show: true,
        title: `Design for task "${task.name}", ID: ${task._id}`,
      },
    });
  }
  showFilterDialog = () => {
    this.setState({
      filterDialog: {
        show: true,
      },
    });
  }
  showLogDialog = (text, title) => {
    this.setState({
      logDialog: {
        show: true,
        text,
        title,
      },
    });
  }
  sortTasks = (tasks, sortKey, direction) => {
    const sortedTasks = JSON.parse(JSON.stringify(tasks));
    const returnValue = direction === 'asc' ? -1 : 1;
    const sortValue = (val) => {
      if (typeof val === 'number') {
        return val;
      } else if (Moment(val, 'MMMM Do YYYY, h:mm a').isValid()) {
        return Moment(val, 'MMMM Do YYYY, h:mm a').format('x');
      }
      return val.toUpperCase();
    };
    sortedTasks.sort((a, b) => {
      const nameA = sortValue(a[sortKey]);
      const nameB = sortValue(b[sortKey]);
      if (nameA < nameB) {
        return returnValue;
      }
      if (nameA > nameB) {
        return -returnValue;
      }
      // for when the value is the same, use the _id which has to be unique
      const keyA = a._id;
      const keyB = b._id;
      if (keyA < keyB) {
        return returnValue;
      }
      if (keyA > keyB) {
        return -returnValue;
      }
      return 0;
    });
    return sortedTasks;
  }
  updateSnackbar = (status) => {
    const currentTime = new Date();
    const lastOpen = this.state.snackbar.last;
    const delay = !lastOpen || currentTime - lastOpen > 2000 ?
      0
      :
      2000 - (currentTime - lastOpen)
    ;
    const newSnackBarState = (orignalState, newValues) => {
      return {
        snackbar: Object.assign(
          {},
          orignalState,
          newValues,
          {
            last: currentTime,
          }
        ),
      };
    };
    setTimeout(() => {
      this.setState(({ snackbar }) => {
        if (status.isDeleting) {
          return newSnackBarState(
            snackbar,
            {
              message: 'Cancelling/deleting task',
              open: true,
            }
          );
        } else if (status.didDeleteFail) {
          return newSnackBarState(
            snackbar,
            {
              message: status.message,
              open: true,
            }
          );
        }
        return newSnackBarState(
          snackbar,
          {
            message: status.message,
            open: true,
          }
        );
      });
    }, delay);
  }
  viewTask = (_id) => {
    browserHistory.push(`/analysis/archive/${_id}`);
  }
  render() {
    return (
      <TaskList
        applyFilters={ this.props.applyFilters }
        canEdit={ this.state.canEdit }
        clearFilters={ this.props.clearFilters }
        deleteDialog={ Object.assign(
          {},
          this.state.deleteDialog,
          {
            hideFunc: this.hideDeleteDialog,
            showFunc: this.showDeleteDialog,
          }
        ) }
        deleteTask={ this.deleteTask }
        designDialog={ Object.assign(
          {},
          this.state.designDialog,
          {
            hideFunc: this.hideDesignDialog,
            showFunc: this.showDesignDialog,
          }
        ) }
        downloadTask={ this.downloadTask }
        errorDialog={ Object.assign(
          {},
          this.state.errorDialog,
          {
            hideFunc: this.hideErrorDialog,
          }
        ) }
        filterDialog={ Object.assign(
          {},
          this.state.filterDialog,
          {
            hideFunc: this.hideFilterDialog,
            showFunc: this.showFilterDialog,
          }
        ) }
        filterFuncs={ this.props.filterFuncs }
        filters={ this.props.filters }
        header={ this.state.header }
        iconTooltip={ Object.assign(
          {},
          this.state.tooltip,
          {
            hideFunc: this.hideIconTooltip,
            showFunc: this.showIconTooltip,
          }
        ) }
        logDialog={ Object.assign(
          {},
          this.state.logDialog,
          {
            hideFunc: this.hideLogDialog,
            showFunc: this.showLogDialog,
          }
        ) }
        snackbar={ Object.assign(
          {},
          this.state.snackbar,
          {
            close: this.closeSnackbar,
          }
        ) }
        tasks={ this.state.tasks }
        taskStatus={ this.props.taskStatus }
        tableHeight={ this.state.tableHeight }
        updateTasks={ this.props.updateTasks }
        viewTask={ this.viewTask }
      />
    );
  }
}

TaskListContainer.propTypes = {
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
  tasks: PropTypes.arrayOf(
    PropTypes.shape({}),
  ).isRequired,
  taskStatus: PropTypes.shape({
    didInvalidate: PropTypes.bool,
    fetching: PropTypes.bool,
    message: PropTypes.string,
  }).isRequired,
  token: PropTypes.string.isRequired,
  updateTasks: PropTypes.func.isRequired,
  user: userProp.isRequired,
};

const mapStateToProps = (state) => {
  return {
    token: state.token,
    user: state.user,
  };
};

const Container = connect(
  mapStateToProps,
)(TaskListContainer);

export default Container;
