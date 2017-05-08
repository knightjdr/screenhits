import fetch from 'isomorphic-fetch';

import { userGet } from '../get/project-user-actions';

export const FAIL_POST = 'FAIL_POST';
export const REQUEST_POST = 'REQUEST_POST';
export const RESET_POST = 'RESET_POST';
export const SUCCESS_POST = 'SUCCESS_POST';

export function failPost(_id, message) {
  return {
    _id,
    message,
    type: 'FAIL_POST',
  };
}

export function requestPost(_id) {
  return {
    _id,
    type: 'REQUEST_POST',
  };
}

export function resetPost(_id) {
  return {
    _id,
    type: 'RESET_POST',
  };
}

export function successPost(_id, message) {
  return {
    _id,
    message,
    type: 'SUCCESS_POST',
  };
}

// thunks
const manageUsers = (user, _id, lab, obj, permission) => {
  return (dispatch) => {
    dispatch(requestPost(_id));
    const headers = new Headers();
    headers.append('Accept', 'application/json');
    headers.append('Auth', `${user.name}:${user.email}:${user.lab}:${user.token}`);
    headers.append('Content-Type', 'application/json');
    return fetch('http://localhost:8003/project/users', {
      body: JSON.stringify(obj),
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
        dispatch(successPost(_id, json.message));
        dispatch(userGet(user, _id, lab, permission));
      } else {
        const error = `Status code: ${json.status}; ${json.message}`;
        dispatch(failPost(_id, error));
      }
    })
    .catch((error) => {
      dispatch(failPost(_id, error));
    });
  };
};
export { manageUsers };
