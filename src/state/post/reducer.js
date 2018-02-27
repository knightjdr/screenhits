import {
  FAIL_POST,
  REQUEST_POST,
  RESET_POST,
  SUCCESS_POST,
} from './actions';

const Post = (state = {
  experiment: {
    didSubmitFail: false,
    didSubmitSucceed: false,
    message: null,
    _id: null,
    isSubmitted: false,
  },
  project: {
    didSubmitFail: false,
    didSubmitSucceed: false,
    message: null,
    _id: null,
    isSubmitted: false,
  },
  protocol: {
    didSubmitFail: false,
    didSubmitSucceed: false,
    message: null,
    _id: null,
    isSubmitted: false,
  },
  sample: {
    didSubmitFail: false,
    didSubmitSucceed: false,
    message: null,
    _id: null,
    isSubmitted: false,
  },
  screen: {
    didSubmitFail: false,
    didSubmitSucceed: false,
    message: null,
    _id: null,
    isSubmitted: false,
  },
  template: {
    didSubmitFail: false,
    didSubmitSucceed: false,
    message: null,
    _id: null,
    isSubmitted: false,
  },
}, action) => {
  let modifiedFields = {};
  const updateObject = {};
  switch (action.type) {
    case FAIL_POST:
      modifiedFields = Object.assign({}, state[action.target]);
      modifiedFields.didSubmitFail = true;
      modifiedFields.didSubmitSucceed = false;
      modifiedFields.message = action.message;
      modifiedFields._id = null;
      modifiedFields.isSubmitted = false;
      updateObject[action.target] = modifiedFields;
      return Object.assign({}, state, updateObject);
    case REQUEST_POST:
      modifiedFields = Object.assign({}, state[action.target]);
      modifiedFields.didSubmitFail = false;
      modifiedFields.didSubmitSucceed = false;
      modifiedFields._id = null;
      modifiedFields.isSubmitted = true;
      updateObject[action.target] = modifiedFields;
      return Object.assign({}, state, updateObject);
    case RESET_POST:
      modifiedFields = Object.assign({}, state[action.target]);
      modifiedFields.didSubmitFail = false;
      modifiedFields.didSubmitSucceed = false;
      modifiedFields.message = null;
      modifiedFields._id = null;
      modifiedFields.isSubmitted = false;
      updateObject[action.target] = modifiedFields;
      return Object.assign({}, state, updateObject);
    case SUCCESS_POST:
      modifiedFields = Object.assign({}, state[action.target]);
      modifiedFields.didSubmitFail = false;
      modifiedFields.didSubmitSucceed = true;
      modifiedFields.message = action.message;
      modifiedFields._id = action._id;
      modifiedFields.isSubmitted = false;
      updateObject[action.target] = modifiedFields;
      return Object.assign({}, state, updateObject);
    default:
      return state;
  }
};
export default Post;
