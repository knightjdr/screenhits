import fetch from 'isomorphic-fetch';

import { userGet } from '../get/project-user-actions';

export const FAIL_MANAGE_POST = 'FAIL_MANAGE_POST';
export const REQUEST_MANAGE_POST = 'REQUEST_MANAGE_POST';
export const RESET_MANAGE_POST = 'RESET_MANAGE_POST';
export const SUCCESS_MANAGE_POST = 'SUCCESS_MANAGE_POST';

export function failManagePost(_id, message) {
  return {
    _id,
    message,
    type: 'FAIL_MANAGE_POST',
  };
}

export function requestManagePost(_id) {
  return {
    _id,
    type: 'REQUEST_MANAGE_POST',
  };
}

export function resetManagePost(_id) {
  return {
    _id,
    type: 'RESET_MANAGE_POST',
  };
}

export function successManagePost(_id, message) {
  return {
    _id,
    message,
    type: 'SUCCESS_MANAGE_POST',
  };
}

// thunks
const manageUsers = (user, _id, lab, obj, permission) => {
  return (dispatch) => {
    dispatch(requestManagePost(_id));
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
        dispatch(successManagePost(_id, json.message));
        dispatch(userGet(user, _id, lab, permission));
      } else {
        const error = `Status code: ${json.status}; ${json.message}`;
        dispatch(failManagePost(_id, error));
      }
    })
    .catch((error) => {
      dispatch(failManagePost(_id, error));
    });
  };
};
export { manageUsers };
