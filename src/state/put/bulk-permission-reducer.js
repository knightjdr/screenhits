import {
  FAIL_PUT,
  REQUEST_PUT,
  RESET_PUT,
  SUCCESS_PUT,
} from './bulk-permission-actions';

const Put = (state = {
  didPutFail: false,
  _id: null,
  isPut: false,
  message: null,
}, action) => {
  switch (action.type) {
    case FAIL_PUT:
      return Object.assign({}, state, {
        didPutFail: true,
        _id: action._id,
        isPut: false,
        message: action.message,
      });
    case REQUEST_PUT:
      return Object.assign({}, state, {
        didPutFail: false,
        _id: action._id,
        isPut: true,
        message: null,
      });
    case RESET_PUT:
      return Object.assign({}, state, {
        didPutFail: false,
        _id: null,
        isPut: false,
        message: null,
      });
    case SUCCESS_PUT:
      return Object.assign({}, state, {
        didPutFail: false,
        _id: action._id,
        isPut: false,
        message: action.message,
      });
    default:
      return state;
  }
};
export default Put;
