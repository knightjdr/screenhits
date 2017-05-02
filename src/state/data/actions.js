import fetch from 'isomorphic-fetch';

export const FILL_DATA = 'FILL_DATA';
export const FILL_FAILED = 'FILL_FAILED';
export const IS_FILLING = 'IS_FILLING';

export function fillData(target, arr) {
  return {
    arr,
    target,
    type: 'FILL_DATA',
  };
}

export function fillFailed(target, error) {
  return {
    message: error,
    target,
    type: 'FILL_FAILED',
  };
}

export function isFilling(target) {
  return {
    target,
    type: 'IS_FILLING',
  };
}

// thunks
const getData = (target) => {
  return (dispatch) => {
    dispatch(isFilling(target));
    const headers = new Headers();
    headers.append('Accept', 'application/json');
    headers.append('Auth', 'James Knight:knightjdr@gmail.com:Gingras:auth_token');
    return fetch(`http://localhost:8003/management?target=${target}`, {
      cache: 'default',
      headers,
      mode: 'cors',
    })
    .then((response) => {
      return response.json();
    })
    .then((json) => {
      if (json.status === 200) {
        dispatch(fillData(target, json.data));
      } else {
        const error = `Status code: ${json.status}; ${json.message}`;
        dispatch(fillFailed(target, error));
      }
    })
    .catch((error) => {
      dispatch(fillFailed(target, error));
    });
  };
};
export { getData };
