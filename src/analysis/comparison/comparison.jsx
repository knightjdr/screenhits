import FontAwesome from 'react-fontawesome';
import React from 'react';
import { CSSTransitionGroup } from 'react-transition-group';

import TaskHeatmapView from '../archive/taskView/task-heatmap-view-container';
import { viewTaskProp, sumbitStatus } from '../../types';

import '../archive/taskView/task-view.scss';

const comparisonStatusStyle = {
  left: '50%',
  position: 'absolute',
  transform: 'translate(-50%, 0)',
};
const comparisonContainerStyle = {
  minHeight: 'calc(100vh - 90px)',
  paddingTop: 10,
  position: 'relative',
};

class Comparison extends React.Component {
  render() {
    return (
      <div
        style={ comparisonContainerStyle }
      >
        <CSSTransitionGroup
          transitionName="task-view"
          transitionEnterTimeout={ 400 }
          transitionLeaveTimeout={ 200 }
        >
          {
            this.props.comparisonStatus.isFetching &&
            <div
              style={ comparisonStatusStyle }
            >
              <FontAwesome key="fetching" name="spinner" pulse={ true } /> Fetching comparison...
            </div>
          }
          {
            this.props.comparisonStatus.didInvalidate &&
            <div
              style={ comparisonStatusStyle }
            >
              There was an error performing this comparison: { this.props.comparisonStatus.message }
            </div>
          }
          {
            !this.props.comparisonStatus.isFetching &&
            !this.props.comparisonStatus.didInvalidate &&
            <TaskHeatmapView
              task={ this.props.item }
            />
          }
        </CSSTransitionGroup>
      </div>
    );
  }
}

Comparison.propTypes = {
  comparisonStatus: sumbitStatus.isRequired,
  item: viewTaskProp.isRequired,
};

export default Comparison;
