import {
  FILL_DATA,
  FILL_FAILED,
  IS_FILLING,
  PUSH_DATA,
} from './data-actions';

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
    case FILL_DATA:
      modifiedFields = {
        didInvalidate: false,
        isFetching: false,
        items: action.arr,
        message: null,
      };
      updateObject[action.target] = modifiedFields;
      return Object.assign({}, state, updateObject);
    case FILL_FAILED:
      modifiedFields = {
        didInvalidate: true,
        isFetching: false,
        items: [],
        message: action.message,
      };
      updateObject[action.target] = modifiedFields;
      return Object.assign({}, state, updateObject);
    case IS_FILLING:
      modifiedFields = {
        didInvalidate: false,
        isFetching: true,
        items: [],
        message: null,
      };
      updateObject[action.target] = modifiedFields;
      return Object.assign({}, state, updateObject);
    case PUSH_DATA:
      modifiedFields = Object.assign({}, state[action.target]);
      modifiedFields.items.push(action.obj);
      updateObject[action.target] = modifiedFields;
      return Object.assign({}, state, updateObject);
    default:
      return state;
  }
};
export default Available;
