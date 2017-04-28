import {
  FAIL_POST,
  REQUEST_POST,
  RESET_POST,
  SUCCESS_POST
} from 'root/state/post/actions.js';

const Post = function(state = {
    project: {
      didSubmitFail: false,
      message: null,
      _id: null,
      isSubmitted: false
    }
  }, action) {
    let modifiedFields = {};
    let updateObject = {};
    switch (action.type) {
      case 'FAIL_POST':
        modifiedFields = Object.assign({}, state[action.target]);
        modifiedFields.didSubmitFail = true;
        modifiedFields.message = action.message;
        modifiedFields._id = null;
        modifiedFields.isSubmitted = false;
        updateObject[action.target] = modifiedFields
        return Object.assign({}, state, updateObject);
      case 'REQUEST_POST':
        modifiedFields = Object.assign({}, state[action.target]);
        modifiedFields.didSubmitFail = false;
        modifiedFields._id = null;
        modifiedFields.isSubmitted = true;
        updateObject[action.target] = modifiedFields
        return Object.assign({}, state, updateObject);
      case 'RESET_POST':
        modifiedFields = Object.assign({}, state[action.target]);
        modifiedFields.didSubmitFail = false;
        modifiedFields.message = null;
        modifiedFields._id = null;
        modifiedFields.isSubmitted = false;
        updateObject[action.target] = modifiedFields
        return Object.assign({}, state, updateObject);
      case 'SUCCESS_POST':
        modifiedFields = Object.assign({}, state[action.target]);
        modifiedFields.didSubmitFail = false;
        modifiedFields.message = action.message;
        modifiedFields._id = action._id;
        modifiedFields.isSubmitted = false;
        updateObject[action.target] = modifiedFields
        return Object.assign({}, state, updateObject);
      default:
        return state;
    }
}
export default Post;
