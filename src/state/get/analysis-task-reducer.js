import {
  FAILED_GET_ANALYSIS_TASKS,
  FILL_ANALYSIS_TASKS,
  IS_GETTING_ANALYSIS_TASKS,
} from './analysis-task-actions';

const Tasks = (state = {
  didInvalidate: false,
  isFetching: false,
  items: [],
  message: null,
}, action) => {
  switch (action.type) {
    case FAILED_GET_ANALYSIS_TASKS:
      return Object.assign(
        {},
        state,
        {
          didInvalidate: true,
          isFetching: false,
          items: [],
          message: action.message,
        }
      );
    case FILL_ANALYSIS_TASKS:
      return Object.assign(
        {},
        state,
        {
          didInvalidate: false,
          isFetching: false,
          items: action.tasks,
          message: action.message,
        }
      );
    case IS_GETTING_ANALYSIS_TASKS:
      return Object.assign(
        {},
        state,
        {
          didInvalidate: false,
          isFetching: true,
          items: [],
          message: null,
        }
      );
    default:
      return state;
  }
};
export default Tasks;
