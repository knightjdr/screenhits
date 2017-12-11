import {
  REQUEST_SIGNIN,
  RESET_SIGNIN,
  SIGNIN_FAILED,
  SIGNIN_SUCCESS,
  SIGNOUT,
} from './signin-actions';

const defaultState = {
  isSigningIn: false,
  message: '',
  name: null,
  privilege: null,
  signedIn: false,
  isSigningOut: false,
  signInFailed: false,
  token: null,
};

const Signin = (
  state = Object.assign({}, defaultState),
  action
) => {
  switch (action.type) {
    case REQUEST_SIGNIN:
      return Object.assign(
        {},
        state,
        {
          isSigningIn: true,
        }
      );
    case RESET_SIGNIN:
      return Object.assign(
        {},
        defaultState
      );
    case SIGNIN_FAILED:
      return Object.assign(
        {},
        state,
        {
          isSigningIn: false,
          message: action.message,
          signInFailed: true,
        }
      );
    case SIGNIN_SUCCESS:
      return Object.assign(
        {},
        state,
        {
          email: action.email,
          isSigningIn: false,
          lab: action.lab,
          message: '',
          name: action.name,
          privilege: action.privilege,
          signedIn: true,
          token: action.token,
        }
      );
    case SIGNOUT:
      return Object.assign(
        {},
        defaultState
      );
    default:
      return state;
  }
};
export default Signin;
