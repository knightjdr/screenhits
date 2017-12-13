import fetch from 'isomorphic-fetch';
import { updateToken } from '../set/token-actions';
import { userGet } from '../get/project-user-actions';

export const FAIL_PUT = 'FAIL_ADD_USER_PUT';
export const REQUEST_PUT = 'REQUEST_ADD_USER_PUT';
export const RESET_PUT = 'RESET_ADD_USER_PUT';
export const SUCCESS_PUT = 'SUCCESS_ADD_USER_PUT';

export const failAddUserPut = (_id, message) => {
  return {
    _id,
    message,
    type: 'FAIL_ADD_USER_PUT',
  };
};

export const requestAddUserPut = (_id) => {
  return {
    _id,
    type: 'REQUEST_ADD_USER_PUT',
  };
};

export const resetAddUserPut = () => {
  return {
    type: 'RESET_ADD_USER_PUT',
  };
};

export const successAddUserPut = (_id, message) => {
  return {
    _id,
    message,
    type: 'SUCCESS_ADD_USER_PUT',
  };
};

// thunks
const addUsersAction = (_id, lab, permission, putObj) => {
  return (dispatch, getState) => {
    dispatch(requestAddUserPut(_id));
    const headers = new Headers();
    headers.append('Accept', 'application/json');
    headers.append('Auth-Token', getState().token);
    headers.append('Content-Type', 'application/json');
    return fetch('http://localhost:8003/users/', {
      body: JSON.stringify(putObj),
      cache: 'default',
      headers,
      method: 'PUT',
      mode: 'cors',
    })
    .then((response) => {
      return response.json();
    })
    .then((json) => {
      if (json.status === 200) {
        dispatch(updateToken(json.authToken));
        dispatch(successAddUserPut(_id, json.message));
        dispatch(userGet(_id, lab, permission));
      } else {
        const error = `Status code: ${json.status}; ${json.message}`;
        dispatch(failAddUserPut(_id, error));
      }
    })
    .catch((error) => {
      dispatch(failAddUserPut(_id, error));
    });
  };
};
export { addUsersAction };
