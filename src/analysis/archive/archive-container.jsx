import deepEqual from 'deep-equal';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import Archive from './archive';
import getAnalysisTasks from '../../state/get/analysis-task-actions';

class ArchiveContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tasks: JSON.parse(JSON.stringify(this.props.tasks.items)),
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
      this.setState({
        tasks: JSON.parse(JSON.stringify(tasks.items)),
        taskStatus: {
          didInvalidate: tasks.didInvalidate,
          fetching: tasks.fetching,
          message: tasks.message,
        },
      });
    }
  }
  render() {
    return (
      <Archive
        tasks={ this.state.tasks }
        taskStatus={ this.state.taskStatus }
      />
    );
  }
}

ArchiveContainer.defaultProps = {
  user: {
    email: null,
    lab: null,
    name: null,
  },
};

ArchiveContainer.propTypes = {
  getAnalysisTasks: PropTypes.func.isRequired,
  tasks: PropTypes.shape({
    didSubmitFail: PropTypes.bool,
    isSubmitted: PropTypes.bool,
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
