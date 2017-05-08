import {
  FAIL_POST,
  REQUEST_POST,
  RESET_POST,
  SUCCESS_POST,
} from './project-manage-actions';

const Get = (state = {
  didPostFail: false,
  message: null,
  _id: null,
  isPost: false,
}, action) => {
  const modifiedFields = {
    _id: action._id,
  };
  switch (action.type) {
    case FAIL_POST:
      modifiedFields.didPostFail = true;
      modifiedFields.message = action.message;
      modifiedFields.isPost = false;
      return Object.assign({}, state, modifiedFields);
    case REQUEST_POST:
      modifiedFields.didPostFail = false;
      modifiedFields.message = null;
      modifiedFields.isPost = true;
      return Object.assign({}, state, modifiedFields);
    case RESET_POST:
      modifiedFields.didPostFail = false;
      modifiedFields.message = null;
      modifiedFields.isPost = false;
      return Object.assign({}, state, modifiedFields);
    case SUCCESS_POST:
      modifiedFields.didPostFail = false;
      modifiedFields.message = action.message;
      modifiedFields.isPost = false;
      return Object.assign({}, state, modifiedFields);
    default:
      return state;
  }
};
export default Get;
