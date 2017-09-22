import {
  FAIL_PROTOCOL_GET,
  REQUEST_PROTOCOL_GET,
  RESET_PROTOCOL_GET,
  SUCCESS_PROTOCOL_GET,
} from './protocol-actions';

const Get = (state = {
  didGetFail: false,
  message: null,
  isGet: false,
  list: [],
}, action) => {
  const modifiedFields = {};
  switch (action.type) {
    case FAIL_PROTOCOL_GET:
      modifiedFields.didGetFail = true;
      modifiedFields.message = action.message;
      modifiedFields.isGet = false;
      modifiedFields.list = [];
      return Object.assign({}, state, modifiedFields);
    case REQUEST_PROTOCOL_GET:
      modifiedFields.didGetFail = false;
      modifiedFields.message = null;
      modifiedFields.isGet = true;
      modifiedFields.list = [];
      return Object.assign({}, state, modifiedFields);
    case RESET_PROTOCOL_GET:
      modifiedFields.didGetFail = false;
      modifiedFields.message = null;
      modifiedFields.isGet = false;
      modifiedFields.list = [];
      return Object.assign({}, state, modifiedFields);
    case SUCCESS_PROTOCOL_GET:
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
