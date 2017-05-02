import {
  FAIL_PUT,
  REQUEST_PUT,
  RESET_PUT,
  SUCCESS_PUT,
} from './actions';

const Put = (state = {
  experiment: [],
  project: [],
  sample: [],
  screen: [],
}, action) => {
  let index;
  let newPut = {};
  let putState = [];
  const updateObject = {};
  switch (action.type) {
    case FAIL_PUT:
      newPut = {
        _id: action._id,
        didPutFail: true,
        message: action.message,
        isPut: false,
      };
      putState = state[action.target] ? state[action.target].slice() : [];
      index = putState.findIndex((obj) => { return obj._id === action._id; });
      if (index > -1) {
        putState[index] = newPut;
      } else {
        putState.push(newPut);
      }
      updateObject[action.target] = putState;
      return Object.assign({}, state, updateObject);
    case REQUEST_PUT:
      newPut = {
        _id: action._id,
        didPutFail: false,
        message: null,
        isPut: true,
      };
      putState = state[action.target] ? state[action.target].slice() : [];
      index = putState.findIndex((obj) => { return obj._id === action._id; });
      if (index > -1) {
        putState[index] = newPut;
      } else {
        putState.push(newPut);
      }
      updateObject[action.target] = putState;
      return Object.assign({}, state, updateObject);
    case RESET_PUT:
      putState = state[action.target] ? state[action.target].slice() : [];
      index = putState.findIndex((obj) => { return obj._id === action._id; });
      if (index > -1) {
        putState.splice(index, 1);
        updateObject[action.target] = putState;
        return Object.assign({}, state, updateObject);
      }
      return state;
    case SUCCESS_PUT:
      newPut = {
        _id: action._id,
        didPutFail: false,
        message: action.message,
        isPut: false,
      };
      putState = state[action.target] ? state[action.target].slice() : [];
      index = putState.findIndex((obj) => { return obj._id === action._id; });
      if (index > -1) {
        putState[index] = newPut;
      } else {
        putState.push(newPut);
      }
      updateObject[action.target] = putState;
      return Object.assign({}, state, updateObject);
    default:
      return state;
  }
};
export default Put;
