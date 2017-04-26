import fetch from 'isomorphic-fetch';
import { getData } from 'root/state/data/actions.js';

export const FAIL_POST = 'FAIL_POST';
export const REQUEST_POST = 'REQUEST_POST';
export const RESET_POST = 'RESET_POST';
export const SUCCESS_POST = 'SUCCESS_POST';

export function failPost(target, message) {
  return {
    message,
    target,
    type: 'FAIL_POST',
  }
}

export function requestPost(target) {
  return {
    target,
    type: 'REQUEST_POST',
  }
}

export function resetPost(target) {
  return {
    target,
    type: 'RESET_POST',
  }
}

export function successPost(target, message) {
  return {
    message,
    target,
    type: 'SUCCESS_POST',
  }
}

//thunks
export function submitPost(target, obj) {
  return function(dispatch) {
    dispatch(requestPost(target));
    let headers = new Headers();
    headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/json');
    return fetch('http://localhost:8003/creation/', {
        body: JSON.stringify(obj),
        cache: 'default',
        headers: headers,
        method: 'POST',
        mode: 'cors',
      })
      .then(response => response.json())
      .then(json => {
        if(json.status === 200) {
          dispatch(successPost(target, json.message));
          dispatch(getData(target));
        } else {
          const error = 'Status code: ' + json.status + '; ' + json.message;
          dispatch(failPost(target, error));
        }
      })
      .catch(error =>
        dispatch(failPost(target, error))
      )
    ;
  }
}
