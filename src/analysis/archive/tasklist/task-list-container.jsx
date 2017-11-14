import PropTypes from 'prop-types';
import React from 'react';

import TaskList from './task-list';

class TaskListContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      header: [
        {
          name: 'ID',
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
          name: 'Status',
          sort: true,
          type: 'status',
        },
        {
          name: 'Options',
          sort: false,
          type: 'options',
        },
      ],
      tableHeight: this.getHeight(),
    };
  }
  componentDidMount() {
    window.addEventListener('resize', this.resize);
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.resize);
  }
  getHeight = () => {
    // top = window height * 5%
    // dialog header = 77, dialog footer = 53
    // tabs = 48
    // content margin top = 20, bottom = 24
    // paragraph + bottom margin = 34
    // table padding = 1, header 59
    // row = 50, footer 51
    // based on above, content not for rows = 367
    // max table height (want top and bottom padding of 5%, so * 0.9)
    const maxHeightRows = (window.innerHeight * 0.90) - 440;
    const neededHeightRows = (this.props.tasks.length * 50);
    let rowHeight = neededHeightRows < maxHeightRows ? neededHeightRows : maxHeightRows;
    // must give space for at least one row
    if (rowHeight < 50) {
      rowHeight = 50;
    }
    return rowHeight + 111;
  }
  resize = () => {
    this.setState({
      tableHeight: this.getHeight(),
    });
  }
  render() {
    return (
      <TaskList
        header={ this.state.header }
        tasks={ this.props.tasks }
        tableHeight={ this.state.tableHeight }
      />
    );
  }
}

TaskListContainer.propTypes = {
  tasks: PropTypes.arrayOf(
    PropTypes.shape({}),
  ).isRequired,
};

export default TaskListContainer;
