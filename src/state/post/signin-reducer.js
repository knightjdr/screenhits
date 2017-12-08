import {
  REQUEST_SIGNIN,
  REQUEST_SIGNOUT,
  RESET_SIGNIN,
  SIGNIN_FAILED,
  SIGNIN_SUCCESS,
  SIGNOUT_FAILED,
  SIGNOUT_SUCCESS,
} from './signin-actions';

const defaultState = {
  email: null,
  isSigningIn: false,
  lab: null,
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
    case REQUEST_SIGNOUT:
      return Object.assign(
        {},
        state,
        {
          isSigningOut: true,
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
    case SIGNOUT_FAILED:
      return Object.assign(
        {},
        state,
        {
          isSigningOut: false,
          message: action.message,
          signOutFailed: true,
        }
      );
    case SIGNOUT_SUCCESS:
      return Object.assign(
        {},
        defaultState
      );
    default:
      return state;
  }
};
export default Signin;
