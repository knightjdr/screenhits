import fetch from 'isomorphic-fetch';
import { updateToken } from '../set/token-actions';

export const FILL_LEVEL_DATA = 'FILL_LEVEL_DATA';
export const FILL_LEVEL_FAILED = 'FILL_LEVEL_FAILED';
export const IS_LEVEL_FILLING = 'IS_LEVEL_FILLING';

export function fillLevelData(items, target) {
  return {
    items,
    target,
    type: 'FILL_LEVEL_DATA',
  };
}

export function fillLevelFailed(target, error) {
  return {
    message: error,
    target,
    type: 'FILL_LEVEL_FAILED',
  };
}

export function isLevelFilling(target) {
  return {
    target,
    type: 'IS_LEVEL_FILLING',
  };
}

// thunks
const getLevelData = (target, user) => {
  return (dispatch) => {
    dispatch(isLevelFilling(target));
    const headers = new Headers();
    headers.append('Accept', 'application/json');
    headers.append('Auth', `${user.name}:${user.email}:${user.lab}:${user.token}`);
    headers.append('Content-Type', 'application/json');
    const url = `http://localhost:8003/management/list?target=${target}`;
    return fetch(url, {
      cache: 'default',
      headers,
      mode: 'cors',
    })
    .then((response) => {
      return response.json();
    })
    .then((json) => {
      if (json.status === 200) {
        dispatch(updateToken(json.token));
        dispatch(fillLevelData(json.data, target));
      } else {
        const error = `Status code: ${json.status}; ${json.message}`;
        dispatch(fillLevelFailed(target, error));
      }
    })
    .catch((error) => {
      const writeError = typeof error !== 'string' ? 'unknown error' : error;
      dispatch(fillLevelFailed(target, writeError));
    });
  };
};
export default getLevelData;
