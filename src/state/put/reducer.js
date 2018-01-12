import {
  FAIL_PUT,
  REQUEST_PUT,
  RESET_PUT,
  SUCCESS_PUT,
} from './actions';

const Put = (state = {
  experiment: {
    didPutFail: false,
    message: null,
    _id: null,
    isPut: false,
  },
  project: {
    didPutFail: false,
    message: null,
    _id: null,
    isPut: false,
  },
  protocol: {
    didPutFail: false,
    message: null,
    _id: null,
    isPut: false,
  },
  sample: {
    didPutFail: false,
    message: null,
    _id: null,
    isPut: false,
  },
  screen: {
    didPutFail: false,
    message: null,
    _id: null,
    isPut: false,
  },
  template: {
    didPutFail: false,
    message: null,
    _id: null,
    isPut: false,
  },
}, action) => {
  let modifiedFields = {};
  const updateObject = {};
  switch (action.type) {
    case FAIL_PUT:
      modifiedFields = Object.assign({}, state[action.target]);
      modifiedFields.didPutFail = true;
      modifiedFields.message = action.message;
      modifiedFields._id = action._id;
      modifiedFields.isPut = false;
      updateObject[action.target] = modifiedFields;
      return Object.assign({}, state, updateObject);
    case REQUEST_PUT:
      modifiedFields = Object.assign({}, state[action.target]);
      modifiedFields.didPutFail = false;
      modifiedFields._id = action._id;
      modifiedFields.isPut = true;
      updateObject[action.target] = modifiedFields;
      return Object.assign({}, state, updateObject);
    case RESET_PUT:
      modifiedFields = Object.assign({}, state[action.target]);
      modifiedFields.didPutFail = false;
      modifiedFields.message = null;
      modifiedFields._id = null;
      modifiedFields.isPut = false;
      updateObject[action.target] = modifiedFields;
      return Object.assign({}, state, updateObject);
    case SUCCESS_PUT:
      modifiedFields = Object.assign({}, state[action.target]);
      modifiedFields.didPutFail = false;
      modifiedFields.message = action.message;
      modifiedFields._id = action._id;
      modifiedFields.isPut = false;
      updateObject[action.target] = modifiedFields;
      return Object.assign({}, state, updateObject);
    default:
      return state;
  }
};
export default Put;
