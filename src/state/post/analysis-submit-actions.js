import fetch from 'isomorphic-fetch';
import { updateToken } from '../set/token-actions';

export const FAIL_ANALYSIS_POST = 'FAIL_ANALYSIS_POST';
export const REQUEST_ANALYSIS_POST = 'REQUEST_ANALYSIS_POST';
export const RESET_ANALYSIS_POST = 'RESET_ANALYSIS_POST';
export const SUCCESS_ANALYSIS_POST = 'SUCCESS_ANALYSIS_POST';

export function failAnalysisPost(message) {
  return {
    message,
    type: 'FAIL_ANALYSIS_POST',
  };
}

export function requestAnalysisPost() {
  return {
    type: 'REQUEST_ANALYSIS_POST',
  };
}

export function resetAnalysisPost() {
  return {
    type: 'RESET_ANALYSIS_POST',
  };
}

export function successAnalysisPost(message) {
  return {
    message,
    type: 'SUCCESS_ANALYSIS_POST',
  };
}

// thunks
const submitAnalysis = (user, form) => {
  return (dispatch) => {
    dispatch(requestAnalysisPost());
    const headers = new Headers();
    headers.append('Accept', 'application/json');
    headers.append('Auth', `${user.name}:${user.email}:${user.lab}:${user.token}`);
    headers.append('Content-Type', 'application/json');
    return fetch('http://localhost:8003/analysis/new', {
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
        dispatch(successAnalysisPost(json.message));
      } else {
        const error = `Status code: ${json.status}; ${json.message}`;
        dispatch(failAnalysisPost(error));
      }
    })
    .catch((error) => {
      const writeError = typeof error !== 'string' ? 'unknown error' : error;
      dispatch(failAnalysisPost(writeError));
    });
  };
};
export default submitAnalysis;
