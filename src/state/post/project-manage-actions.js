import fetch from 'isomorphic-fetch';

import { updateToken } from '../set/token-actions';

import { userGet } from '../get/project-user-actions';

export const FAIL_MANAGE_POST = 'FAIL_MANAGE_POST';
export const REQUEST_MANAGE_POST = 'REQUEST_MANAGE_POST';
export const RESET_MANAGE_POST = 'RESET_MANAGE_POST';
export const SUCCESS_MANAGE_POST = 'SUCCESS_MANAGE_POST';

export const failManagePost = (_id, message) => {
  return {
    _id,
    message,
    type: 'FAIL_MANAGE_POST',
  };
};

export const requestManagePost = (_id) => {
  return {
    _id,
    type: 'REQUEST_MANAGE_POST',
  };
};

export const resetManagePost = (_id) => {
  return {
    _id,
    type: 'RESET_MANAGE_POST',
  };
};

export const successManagePost = (_id, message) => {
  return {
    _id,
    message,
    type: 'SUCCESS_MANAGE_POST',
  };
};

// thunks
const manageUsers = (_id, lab, obj, permission) => {
  return (dispatch, getState) => {
    dispatch(requestManagePost(_id));
    const headers = new Headers();
    headers.append('Accept', 'application/json');
    headers.append('Auth-Token', getState().token);
    headers.append('Content-Type', 'application/json');
    return fetch(`${process.env.API_ROOT}/project/users`, {
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
        dispatch(updateToken(json.authToken));
        dispatch(successManagePost(_id, json.message));
        dispatch(userGet(_id, lab, permission));
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
