import fetch from 'isomorphic-fetch';
import { getData } from 'root/state/data/actions.js';

export const FAIL_PUT = 'FAIL_PUT';
export const REQUEST_PUT = 'REQUEST_PUT';
export const RESET_PUT = 'RESET_PUT';
export const SUCCESS_PUT = 'SUCCESS_PUT';

export function failPut(_id, message, target) {
  return {
    _id,
    message,
    target,
    type: 'FAIL_PUT',
  }
}

export function requestPut(_id, target) {
  return {
    _id,
    target,
    type: 'REQUEST_PUT',
  }
}

export function resetPut(_id, target) {
  return {
    _id,
    target,
    type: 'RESET_PUT',
  }
}

export function successPut(_id, message, target) {
  return {
    _id,
    message,
    target,
    type: 'SUCCESS_PUT',
  }
}

//thunks
export function submitPut(_id, obj, target) {
  return function(dispatch) {
    dispatch(requestPut(_id, target));
    let headers = new Headers();
    headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/json');
    obj.target = target;
    return fetch('http://localhost:8003/management/', {
        body: JSON.stringify(obj),
        cache: 'default',
        headers: headers,
        method: 'PUT',
        mode: 'cors',
      })
      .then(response => response.json())
      .then((json) => {
        if(json.status === 200) {
          dispatch(successPut(_id, json.message, target));
          dispatch(getData(target));
        } else {
          const error = 'Status code: ' + json.status + '; ' + json.message;
          dispatch(failPut(_id, error, target));
        }
      })
      .catch((error) =>
        dispatch(failPut(_id, error, target))
      )
    ;
  }
}
