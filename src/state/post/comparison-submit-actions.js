import fetch from 'isomorphic-fetch';
import { updateToken } from '../set/token-actions';

export const FAIL_COMPARISON_POST = 'FAIL_COMPARISON_POST';
export const REQUEST_COMPARISON_POST = 'REQUEST_COMPARISON_POST';
export const RESET_COMPARISON_POST = 'RESET_COMPARISON_POST';
export const SUCCESS_COMPARISON_POST = 'SUCCESS_COMPARISON_POST';

export const failComparisonPost = (message) => {
  return {
    message,
    type: 'FAIL_COMPARISON_POST',
  };
};

export const requestComparisonPost = () => {
  return {
    type: 'REQUEST_COMPARISON_POST',
  };
};

export const resetComparisonPost = () => {
  return {
    type: 'RESET_COMPARISON_POST',
  };
};

export const successComparisonPost = (item, message) => {
  return {
    item,
    message,
    type: 'SUCCESS_COMPARISON_POST',
  };
};

// thunks
const submitComparison = (form) => {
  return (dispatch, getState) => {
    dispatch(requestComparisonPost());
    const headers = new Headers();
    headers.append('Accept', 'application/json');
    headers.append('Auth-Token', getState().token);
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
        dispatch(updateToken(json.authToken));
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
