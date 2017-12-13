import fetch from 'isomorphic-fetch';
import { updateToken } from '../set/token-actions';
import { getData } from '../get/data-actions';

export const FAIL_PUT = 'FAIL_PUT';
export const REQUEST_PUT = 'REQUEST_PUT';
export const RESET_PUT = 'RESET_PUT';
export const SUCCESS_PUT = 'SUCCESS_PUT';

export const failPut = (_id, message, target) => {
  return {
    _id,
    message,
    target,
    type: 'FAIL_PUT',
  };
};

export const requestPut = (_id, target) => {
  return {
    _id,
    target,
    type: 'REQUEST_PUT',
  };
};

export const resetPut = (target) => {
  return {
    target,
    type: 'RESET_PUT',
  };
};

export const successPut = (_id, message, target) => {
  return {
    _id,
    message,
    target,
    type: 'SUCCESS_PUT',
  };
};

// thunks
const submitPut = (_id, obj, target) => {
  return (dispatch, getState) => {
    dispatch(requestPut(_id, target));
    const headers = new Headers();
    headers.append('Accept', 'application/json');
    headers.append('Auth-Token', getState().token);
    headers.append('Content-Type', 'application/json');
    const submitObj = Object.assign({}, obj);
    submitObj.target = target;
    return fetch('http://localhost:8003/management/', {
      body: JSON.stringify(submitObj),
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
        dispatch(successPut(_id, json.message, target));
        dispatch(getData(target, obj.group ? obj.group : {}, null));
      } else {
        const error = `Status code: ${json.status}; ${json.message}`;
        dispatch(failPut(_id, error, target));
      }
    })
    .catch((error) => {
      const writeError = typeof error !== 'string' ? 'unknown error' : error;
      dispatch(failPut(_id, writeError, target));
    });
  };
};
export { submitPut };
