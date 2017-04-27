import {
  FAIL_PUT,
  REQUEST_PUT,
  RESET_PUT,
  SUCCESS_PUT
} from 'root/state/put/actions.js';

const Put = function(state = {
    experiment: [],
    project: [],
    sample: [],
    screen: []
  }, action) {
    let index;
    let newPut = {};
    let putState = [];
    let updateObject = {};
    switch (action.type) {
      case FAIL_PUT:
        newPut = {
          _id: action._id,
          didPutFail: true,
          message: action.message,
          isPut: false
        };
        putState = state[action.target] ? state[action.target].slice() : [];
        index = putState.findIndex(obj => obj._id === action._id);
        if(index > -1) {
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
          isPut: true
        };
        putState = state[action.target] ? state[action.target].slice() : [];
        index = putState.findIndex(obj => obj._id === action._id);
        if(index > -1) {
          putState[index] = newPut;
        } else {
          putState.push(newPut);
        }
        updateObject[action.target] = putState;
        return Object.assign({}, state, updateObject);
      case RESET_PUT:
        putState = state[action.target] ? state[action.target].slice() : [];
        index = putState.findIndex(obj => obj._id === action._id);
        console.log(action._id, index);
        if(index > -1) {
          putState.splice(index, 1)
          updateObject[action.target] = putState;
          return Object.assign({}, state, updateObject);
        }
        return;
      case SUCCESS_PUT:
        newPut = {
          _id: action._id,
          didPutFail: false,
          message: action.message,
          isPut: false
        };
        putState = state[action.target] ? state[action.target].slice() : [];
        index = putState.findIndex(obj => obj._id === action._id);
        if(index > -1) {
          putState[index] = newPut;
        } else {
          putState.push(newPut);
        }
        updateObject[action.target] = putState;
        return Object.assign({}, state, updateObject);
      default:
        return state;
    }
}
export default Put;
