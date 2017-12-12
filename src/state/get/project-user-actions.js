import fetch from 'isomorphic-fetch';
import { updateToken } from '../set/token-actions';

export const FAIL_GET = 'FAIL_GET';
export const REQUEST_GET = 'REQUEST_GET';
export const RESET_GET = 'RESET_GET';
export const SUCCESS_GET = 'SUCCESS_GET';

export function failGet(_id, message) {
  return {
    _id,
    message,
    type: 'FAIL_GET',
  };
}

export function requestGet(_id) {
  return {
    _id,
    type: 'REQUEST_GET',
  };
}

export function resetGet(_id) {
  return {
    _id,
    type: 'RESET_GET',
  };
}

export function successGet(_id, message, list) {
  return {
    _id,
    list,
    message,
    type: 'SUCCESS_GET',
  };
}

// thunks
const userGet = (user, _id, lab, permission) => {
  return (dispatch) => {
    dispatch(requestGet(_id));
    const headers = new Headers();
    headers.append('Accept', 'application/json');
    headers.append('Auth', `${user.name}:${user.email}:${user.lab}:${user.token}`);
    headers.append('Content-Type', 'application/json');
    return fetch(`http://localhost:8003/project/users?_id=${_id}&lab=${lab}&permission=${permission}`, {
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
