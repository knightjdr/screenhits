import deepEqual from 'deep-equal';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import getViewTask from '../../../state/get/view-task-actions';
import TaskView from './task-view';
import { userProp, viewTaskStoreProp } from '../../../types';

class TaskViewContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      viewStatus: {
        didInvalidate: this.props.viewTask.didInvalidate,
        isFetching: this.props.viewTask.isFetching,
        message: this.props.viewTask.message,
      },
      viewTask: this.props.viewTask.task,
    };
  }
  componentDidMount = () => {
    if (this.props.viewID) {
      this.props.getViewTask(this.props.viewID, this.props.user);
    }
  }
  componentWillReceiveProps = (nextProps) => {
    const { viewTask } = nextProps;
    if (!deepEqual(viewTask, this.props.viewTask)) {
      this.setState({
        viewStatus: {
          didInvalidate: viewTask.didInvalidate,
          isFetching: viewTask.isFetching,
          message: viewTask.message,
        },
        viewTask: JSON.parse(JSON.stringify(viewTask.task)),
      });
    }
  }
  render() {
    return (
      <TaskView
        viewStatus={ this.state.viewStatus }
        task={ this.state.viewTask }
      />
    );
  }
}

TaskViewContainer.defaultProps = {
  viewID: null,
  viewTask: {
    didInvalidate: false,
    isFetching: true,
    message: '',
    task: {
      header: [],
      range: {
        max: 0,
        min: 0,
      },
      results: [],
    },
  },
};

TaskViewContainer.propTypes = {
  getViewTask: PropTypes.func.isRequired,
  user: userProp.isRequired,
  viewID: PropTypes.number,
  viewTask: viewTaskStoreProp,
};

const mapDispatchToProps = (dispatch) => {
  return {
    getViewTask: (id, user) => {
      dispatch(getViewTask(id, user));
    },
  };
};

const mapStateToProps = (state) => {
  return {
    user: state.user,
    viewTask: state.viewTask,
  };
};

const Container = connect(
  mapStateToProps,
  mapDispatchToProps,
)(TaskViewContainer);

export default Container;
