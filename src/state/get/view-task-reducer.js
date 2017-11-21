import {
  FAILED_GET_VIEW_TASK,
  FILL_VIEW_TASK,
  IS_GETTING_VIEW_TASK,
} from './view-task-actions';

const ViewTask = (state = {
  didInvalidate: false,
  isFetching: false,
  task: {},
  message: null,
}, action) => {
  switch (action.type) {
    case FAILED_GET_VIEW_TASK:
      return Object.assign(
        {},
        state,
        {
          didInvalidate: true,
          isFetching: false,
          task: {},
          message: action.message,
        }
      );
    case FILL_VIEW_TASK:
      return Object.assign(
        {},
        state,
        {
          didInvalidate: false,
          isFetching: false,
          task: action.task,
          message: action.message,
        }
      );
    case IS_GETTING_VIEW_TASK:
      return Object.assign(
        {},
        state,
        {
          didInvalidate: false,
          isFetching: true,
          task: {},
          message: null,
        }
      );
    default:
      return state;
  }
};
export default ViewTask;
