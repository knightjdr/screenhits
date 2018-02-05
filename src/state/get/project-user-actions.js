import fetch from 'isomorphic-fetch';

import { updateToken } from '../set/token-actions';

export const FAIL_GET = 'FAIL_GET';
export const REQUEST_GET = 'REQUEST_GET';
export const RESET_GET = 'RESET_GET';
export const SUCCESS_GET = 'SUCCESS_GET';

export const failGet = (_id, message) => {
  return {
    _id,
    message,
    type: 'FAIL_GET',
  };
};

export const requestGet = (_id) => {
  return {
    _id,
    type: 'REQUEST_GET',
  };
};

export const resetGet = (_id) => {
  return {
    _id,
    type: 'RESET_GET',
  };
};

export const successGet = (_id, message, list) => {
  return {
    _id,
    list,
    message,
    type: 'SUCCESS_GET',
  };
};

// thunks
const userGet = (_id, lab, permission) => {
  return (dispatch, getState) => {
    dispatch(requestGet(_id));
    const headers = new Headers();
    headers.append('Accept', 'application/json');
    headers.append('Auth-Token', getState().token);
    headers.append('Content-Type', 'application/json');
    return fetch(`${process.env.API_ROOT}/project/users?_id=${_id}&lab=${lab}&permission=${permission}`, {
      cache: 'default',
      headers,
      method: 'GET',
      mode: 'cors',
    })
    .then((response) => {
      return response.json();
    })
    .then((json) => {
      if (json.status === 200) {
        dispatch(updateToken(json.authToken));
        dispatch(successGet(_id, json.message, json.users));
      } else {
        const error = `Status code: ${json.status}; ${json.message}`;
        dispatch(failGet(_id, error));
      }
    })
    .catch((error) => {
      dispatch(failGet(_id, error));
    });
  };
};
export { userGet };
