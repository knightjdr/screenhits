import deepEqual from 'deep-equal';
import Moment from 'moment';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import AnalysisModule from '../../../modules/analysis-new';
import Download from '../../../helpers/download';
import TaskList from './task-list';

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
      header: tableHeader,
      logDialog: {
        show: false,
        text: '',
        title: '',
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
    const { tasks } = nextProps;
    if (!deepEqual(tasks, this.props.tasks)) {
      this.setState({
        tasks: this.sortTasks(tasks, 'date', 'desc'),
        tableHeight: this.getHeight(tasks),
      });
    }
  }
  componentWillUnmount = () => {
    window.removeEventListener('resize', this.resize);
  }
  getHeight = (table) => {
    const maxHeightRows = (window.innerHeight * 0.90) - 0;
    const neededHeightRows = (table.length * 50);
    let rowHeight = neededHeightRows < maxHeightRows ? neededHeightRows : maxHeightRows;
    // must give space for at least one row
    if (rowHeight < 50) {
      rowHeight = 50;
    }
    return rowHeight + 111;
  }
  deleteTask = (_id) => {
    console.log(_id);
    this.hideDeleteDialog();
  }
  downloadTask = (_id) => {
    const queryString = 'format=tsv';
    Download(
      `task_${_id}`,
      'tsv',
      queryString,
      `analysis/tasks/${_id}`,
      this.props.user
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
    const params = fields.map((field) => {
      const taskValue = task.details[field.name] ? String(task.details[field.name]) : null;
      return {
        name: field.layName,
        value: taskValue || task.defaultValue,
      };
    });
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
  render() {
    return (
      <TaskList
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
        tasks={ this.state.tasks }
        taskStatus={ this.props.taskStatus }
        tableHeight={ this.state.tableHeight }
      />
    );
  }
}

TaskListContainer.defaultProps = {
  user: {
    email: null,
    lab: null,
    name: null,
  },
};

TaskListContainer.propTypes = {
  tasks: PropTypes.arrayOf(
    PropTypes.shape({}),
  ).isRequired,
  taskStatus: PropTypes.shape({
    didInvalidate: PropTypes.bool,
    fetching: PropTypes.bool,
    message: PropTypes.string,
  }).isRequired,
  user: PropTypes.shape({
    email: PropTypes.string,
    lab: PropTypes.string,
    name: PropTypes.string,
  }),
};

const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};

const Container = connect(
  mapStateToProps,
)(TaskListContainer);

export default Container;
