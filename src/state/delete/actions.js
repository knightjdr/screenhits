import fetch from 'isomorphic-fetch';

import API_ROOT from '../../api-config';
import { updateToken } from '../set/token-actions';
import { getData } from '../get/data-actions';

export const FAIL_DELETE = 'FAIL_DELETE';
export const REQUEST_DELETE = 'REQUEST_DELETE';
export const RESET_DELETE = 'RESET_DELETE';
export const SUCCESS_DELETE = 'SUCCESS_DELETE';

export const failDelete = (_id, message, target) => {
  return {
    _id,
    message,
    target,
    type: 'FAIL_DELETE',
  };
};

export const requestDelete = (_id, target) => {
  return {
    _id,
    target,
    type: 'REQUEST_DELETE',
  };
};

export const resetDelete = (target) => {
  return {
    target,
    type: 'RESET_DELETE',
  };
};

export const successDelete = (_id, message, target) => {
  return {
    _id,
    message,
    target,
    type: 'SUCCESS_DELETE',
  };
};

// thunks
const submitDelete = (_id, target, group) => {
  return (dispatch, getState) => {
    dispatch(requestDelete(_id, target));
    const headers = new Headers();
    headers.append('Accept', 'application/json');
    headers.append('Auth-Token', getState().token);
    headers.append('Content-Type', 'application/json');
    const queryString = `target=${target}&_id=${_id}`;
    return fetch(`${API_ROOT}/management?${queryString}`, {
      cache: 'default',
      headers,
      method: 'DELETE',
      mode: 'cors',
    })
    .then((response) => {
      return response.json();
    })
    .then((json) => {
      if (json.status === 200) {
        dispatch(updateToken(json.authToken));
        dispatch(successDelete(_id, json.message, target));
        dispatch(getData(target, group, -1));
      } else {
        const error = `Status code: ${json.status}; ${json.message}`;
        dispatch(failDelete(_id, error, target));
      }
    })
    .catch((error) => {
      const writeError = typeof error !== 'string' ? 'unknown error' : error;
      dispatch(failDelete(_id, writeError, target));
    });
  };
};
export { submitDelete };
