import {
  FAIL_DELETE,
  REQUEST_DELETE,
  RESET_DELETE,
  SUCCESS_DELETE,
} from './actions';

const Delete = (state = {
  experiment: {
    didDeleteFail: false,
    message: null,
    _id: null,
    isDelete: false,
  },
  project: {
    didDeleteFail: false,
    message: null,
    _id: null,
    isDelete: false,
  },
  protocol: {
    didDeleteFail: false,
    message: null,
    _id: null,
    isDelete: false,
  },
  sample: {
    didDeleteFail: false,
    message: null,
    _id: null,
    isDelete: false,
  },
  screen: {
    didDeleteFail: false,
    message: null,
    _id: null,
    isDelete: false,
  },
}, action) => {
  let modifiedFields = {};
  const updateObject = {};
  switch (action.type) {
    case FAIL_DELETE:
      modifiedFields = Object.assign({}, state[action.target]);
      modifiedFields.didDeleteFail = true;
      modifiedFields.message = action.message;
      modifiedFields._id = action._id;
      modifiedFields.isDelete = false;
      updateObject[action.target] = modifiedFields;
      return Object.assign({}, state, updateObject);
    case REQUEST_DELETE:
      modifiedFields = Object.assign({}, state[action.target]);
      modifiedFields.didDeleteFail = false;
      modifiedFields._id = action._id;
      modifiedFields.isDelete = true;
      updateObject[action.target] = modifiedFields;
      return Object.assign({}, state, updateObject);
    case RESET_DELETE:
      modifiedFields = Object.assign({}, state[action.target]);
      modifiedFields.didDeleteFail = false;
      modifiedFields.message = null;
      modifiedFields._id = null;
      modifiedFields.isDelete = false;
      updateObject[action.target] = modifiedFields;
      return Object.assign({}, state, updateObject);
    case SUCCESS_DELETE:
      modifiedFields = Object.assign({}, state[action.target]);
      modifiedFields.didDeleteFail = false;
      modifiedFields.message = action.message;
      modifiedFields._id = action._id;
      modifiedFields.isDelete = false;
      updateObject[action.target] = modifiedFields;
      return Object.assign({}, state, updateObject);
    default:
      return state;
  }
};
export default Delete;
