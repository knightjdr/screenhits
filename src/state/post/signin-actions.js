import fetch from 'isomorphic-fetch';
import { updateToken } from '../set/token-actions';

export const REQUEST_SIGNIN = 'REQUEST_SIGNIN';
export const RESET_SIGNIN = 'RESET_SIGNIN';
export const SIGNIN_FAILED = 'SIGNIN_FAILED';
export const SIGNIN_SUCCESS = 'SIGNIN_SUCCESS';
export const SIGNOUT = 'SIGNOUT';

export const requestSignin = () => {
  return {
    type: 'REQUEST_SIGNIN',
  };
};

export const requestSignout = () => {
  return {
    type: 'REQUEST_SIGNOUT',
  };
};

export const resetSignin = () => {
  return {
    type: 'RESET_SIGNIN',
  };
};

export const signinFailed = (message) => {
  return {
    message,
    type: 'SIGNIN_FAILED',
  };
};

export const signinSuccess = (name, privilege) => {
  return {
    name,
    privilege,
    type: 'SIGNIN_SUCCESS',
  };
};

export const signout = () => {
  return {
    type: 'SIGNOUT',
  };
};

export const signoutFailed = (message) => {
  return {
    message,
    type: 'SIGNOUT_FAILED',
  };
};

export const signoutSuccess = () => {
  return {
    type: 'SIGNOUT_SUCCESS',
  };
};

// thunks
const login = (token) => {
  return (dispatch) => {
    dispatch(resetSignin());
    dispatch(requestSignin());
    const headers = new Headers();
    headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/json');
    const bodyObj = {
      token,
    };
    return fetch('http://localhost:8003/login', {
      body: JSON.stringify(bodyObj),
      cache: 'default',
      headers,
      method: 'POST',
      mode: 'cors',
    })
    .then((response) => {
      return response.json();
    })
    .then((json) => {
      if (json.status === 200) {
        dispatch(updateToken(json.token));
        dispatch(
          signinSuccess(
            json.user.name,
            json.user.privilege
          )
        );
      } else {
        const error = `Status code: ${json.status}; ${json.message}`;
        dispatch(signinFailed(error));
      }
    })
    .catch((error) => {
      const writeError = typeof error !== 'string' ? 'unknown error' : error;
      dispatch(signinFailed(writeError));
    });
  };
};

export { login };
