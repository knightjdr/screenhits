import {
  FILL_LEVEL_DATA,
  FILL_LEVEL_FAILED,
  IS_LEVEL_FILLING,
} from './level-actions';

const Available = (state = {
  experiment: {
    didInvalidate: false,
    isFetching: false,
    items: [],
    message: null,
  },
  project: {
    didInvalidate: false,
    isFetching: false,
    items: [],
    message: null,
  },
  sample: {
    didInvalidate: false,
    isFetching: false,
    items: [],
    message: null,
  },
  screen: {
    didInvalidate: false,
    isFetching: false,
    items: [],
    message: null,
  },
}, action) => {
  let modifiedFields = {};
  const updateObject = {};
  switch (action.type) {
    case FILL_LEVEL_DATA:
      modifiedFields = {
        didInvalidate: false,
        isFetching: false,
        items: action.items,
        message: null,
      };
      updateObject[action.target] = modifiedFields;
      return Object.assign({}, state, updateObject);
    case FILL_LEVEL_FAILED:
      modifiedFields = {
        didInvalidate: true,
        isFetching: false,
        items: [],
        message: action.message,
      };
      updateObject[action.target] = modifiedFields;
      return Object.assign({}, state, updateObject);
    case IS_LEVEL_FILLING:
      modifiedFields = {
        didInvalidate: false,
        isFetching: true,
        items: [],
        message: null,
      };
      updateObject[action.target] = modifiedFields;
      return Object.assign({}, state, updateObject);
    default:
      return state;
  }
};
export default Available;
