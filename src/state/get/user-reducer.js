import {
  FAIL_GET,
  REQUEST_GET,
  RESET_GET,
  SUCCESS_GET,
} from './user-actions';

const Get = (state = {
  didGetFail: false,
  message: null,
  _id: null,
  isGet: false,
  list: [],
}, action) => {
  const modifiedFields = {
    _id: action._id,
  };
  switch (action.type) {
    case FAIL_GET:
      modifiedFields.didGetFail = true;
      modifiedFields.message = action.message;
      modifiedFields.isGet = false;
      modifiedFields.list = [];
      return Object.assign({}, state, modifiedFields);
    case REQUEST_GET:
      modifiedFields.didGetFail = false;
      modifiedFields.message = null;
      modifiedFields.isGet = true;
      modifiedFields.list = [];
      return Object.assign({}, state, modifiedFields);
    case RESET_GET:
      modifiedFields.didGetFail = false;
      modifiedFields.message = null;
      modifiedFields.isGet = false;
      modifiedFields.list = [];
      return Object.assign({}, state, modifiedFields);
    case SUCCESS_GET:
      modifiedFields.didGetFail = false;
      modifiedFields.message = action.message;
      modifiedFields.isGet = false;
      modifiedFields.list = action.list;
      return Object.assign({}, state, modifiedFields);
    default:
      return state;
  }
};
export default Get;
