import fetch from 'isomorphic-fetch';
import { updateToken } from '../set/token-actions';

export const FAIL_COMPARISON_POST = 'FAIL_COMPARISON_POST';
export const REQUEST_COMPARISON_POST = 'REQUEST_COMPARISON_POST';
export const RESET_COMPARISON_POST = 'RESET_COMPARISON_POST';
export const SUCCESS_COMPARISON_POST = 'SUCCESS_COMPARISON_POST';

export function failComparisonPost(message) {
  return {
    message,
    type: 'FAIL_COMPARISON_POST',
  };
}

export function requestComparisonPost() {
  return {
    type: 'REQUEST_COMPARISON_POST',
  };
}

export function resetComparisonPost() {
  return {
    type: 'RESET_COMPARISON_POST',
  };
}

export function successComparisonPost(item, message) {
  return {
    item,
    message,
    type: 'SUCCESS_COMPARISON_POST',
  };
}

// thunks
const submitComparison = (user, form) => {
  return (dispatch) => {
    dispatch(requestComparisonPost());
    const headers = new Headers();
    headers.append('Accept', 'application/json');
    headers.append('Auth', `${user.name}:${user.email}:${user.lab}:${user.token}`);
    headers.append('Content-Type', 'application/json');
    return fetch('http://localhost:8003/analysis/comparison', {
      body: JSON.stringify(form),
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
        dispatch(updateToken(json.token));
        dispatch(successComparisonPost(json.data, json.message));
      } else {
        const error = `Status code: ${json.status}; ${json.message}`;
        dispatch(failComparisonPost(error));
      }
    })
    .catch((error) => {
      const writeError = typeof error !== 'string' ? 'unknown error' : error;
      dispatch(failComparisonPost(writeError));
    });
  };
};
export default submitComparison;
