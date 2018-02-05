import fetch from 'isomorphic-fetch';

import API_ROOT from '../../api-config';
import { updateToken } from '../set/token-actions';
import { pushData } from '../get/data-actions';

export const FAIL_POST = 'FAIL_POST';
export const REQUEST_POST = 'REQUEST_POST';
export const RESET_POST = 'RESET_POST';
export const SUCCESS_POST = 'SUCCESS_POST';

export const failPost = (target, message) => {
  return {
    message,
    target,
    type: 'FAIL_POST',
  };
};

export const requestPost = (target) => {
  return {
    target,
    type: 'REQUEST_POST',
  };
};

export const resetPost = (target) => {
  return {
    target,
    type: 'RESET_POST',
  };
};

export const successPost = (_id, message, target) => {
  return {
    _id,
    message,
    target,
    type: 'SUCCESS_POST',
  };
};

// thunks
const submitPost = (target, obj, isFormData = false) => {
  return (dispatch, getState) => {
    dispatch(requestPost(target));
    const headers = new Headers();
    headers.append('Accept', 'application/json');
    headers.append('Auth-Token', getState().token);
    if (!isFormData) {
      headers.append('Content-Type', 'application/json');
    }
    const body = isFormData ? obj : JSON.stringify(obj);
    return fetch(`${API_ROOT}/management/`, {
      body,
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
        if (target !== 'sample') {
          dispatch(pushData(json.obj, target));
        }
        dispatch(successPost(json._id, json.message, target));
      } else {
        const error = `Status code: ${json.status}; ${json.message}`;
        dispatch(failPost(target, error));
      }
    })
    .catch((error) => {
      const writeError = typeof error !== 'string' ? 'unknown error' : error;
      dispatch(failPost(target, writeError));
    });
  };
};
export { submitPost };
