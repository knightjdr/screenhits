import fetch from 'isomorphic-fetch';
import { updateToken } from '../set/token-actions';

export const FAIL_PROTOCOL_GET = 'FAIL_PROTOCOL_GET';
export const REQUEST_PROTOCOL_GET = 'REQUEST_PROTOCOL_GET';
export const RESET_PROTOCOL_GET = 'RESET_PROTOCOL_GET';
export const SUCCESS_PROTOCOL_GET = 'SUCCESS_PROTOCOL_GET';

export function failProtocolGet(message) {
  return {
    message,
    type: 'FAIL_PROTOCOL_GET',
  };
}

export function requestProtocolGet() {
  return {
    type: 'REQUEST_PROTOCOL_GET',
  };
}

export function resetProtocolGet() {
  return {
    type: 'RESET_PROTOCOL_GET',
  };
}

export function successProtocolGet(message, arr) {
  return {
    arr,
    message,
    type: 'SUCCESS_PROTOCOL_GET',
  };
}

// thunks
const protocolGet = (user) => {
  return (dispatch) => {
    dispatch(requestProtocolGet());
    const headers = new Headers();
    headers.append('Accept', 'application/json');
    headers.append('Auth', `${user.name}:${user.email}:${user.lab}:${user.token}`);
    headers.append('Content-Type', 'application/json');
    return fetch(`http://localhost:8003/protocol?user=${user.email}`, {
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
        dispatch(successProtocolGet(json.message, json.protocols));
      } else {
        const error = `Status code: ${json.status}; ${json.message}`;
        dispatch(failProtocolGet(error));
      }
    })
    .catch((error) => {
      dispatch(failProtocolGet(error));
    });
  };
};
export { protocolGet };
