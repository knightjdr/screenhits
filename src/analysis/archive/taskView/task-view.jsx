import FontAwesome from 'react-fontawesome';
import React from 'react';
import { CSSTransitionGroup } from 'react-transition-group';

import TaskHeatmapView from './task-heatmap-view-container';
import { viewTaskProp, viewTaskStatus } from '../../../types';

import './task-view.scss';

const taskStatusStyle = {
  left: '50%',
  position: 'absolute',
  transform: 'translate(-50%, 0)',
};
const taskViewContainerStyle = {
  minHeight: 'calc(100vh - 90px)',
  paddingTop: 10,
  position: 'relative',
};

class TaskView extends React.Component {
  render() {
    return (
      <div
        style={ taskViewContainerStyle }
      >
        <CSSTransitionGroup
          transitionName="task-view"
          transitionEnterTimeout={ 400 }
          transitionLeaveTimeout={ 200 }
        >
          {
            this.props.viewStatus.isFetching &&
            <div
              style={ taskStatusStyle }
            >
              <FontAwesome key="fetching" name="spinner" pulse={ true } /> Fetching task...
            </div>
          }
          {
            this.props.viewStatus.didInvalidate &&
            <div
              style={ taskStatusStyle }
            >
              There was an error visualizing this task: { this.props.viewStatus.message }
            </div>
          }
          {
            !this.props.viewStatus.isFetching &&
            !this.props.viewStatus.didInvalidate &&
            <TaskHeatmapView
              task={ this.props.task }
            />
          }
        </CSSTransitionGroup>
      </div>
    );
  }
}

TaskView.propTypes = {
  task: viewTaskProp.isRequired,
  viewStatus: viewTaskStatus.isRequired,
};

export default TaskView;
