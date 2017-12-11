import fetch from 'isomorphic-fetch';
import { updateToken } from '../set/token-actions';

export const FAILED_GET_ANALYSIS_TASKS = 'FAILED_GET_ANALYSIS_TASKS';
export const FILL_ANALYSIS_TASKS = 'FILL_ANALYSIS_TASKS';
export const IS_GETTING_ANALYSIS_TASKS = 'IS_GETTING_ANALYSIS_TASKS';

export function failedGetAnalysisTasks(error) {
  return {
    message: error,
    type: 'FAILED_GET_ANALYSIS_TASKS',
  };
}

export function fillAnalysisTasks(message, tasks) {
  return {
    message,
    tasks,
    type: 'FILL_ANALYSIS_TASKS',
  };
}

export function isGettingAnalysisTasks() {
  return {
    type: 'IS_GETTING_ANALYSIS_TASKS',
  };
}

// thunks
const getAnalysisTasks = (user) => {
  return (dispatch) => {
    dispatch(isGettingAnalysisTasks());
    const headers = new Headers();
    headers.append('Accept', 'application/json');
    headers.append('Auth', `${user.name}:${user.email}:${user.lab}:${user.token}`);
    headers.append('Content-Type', 'application/json');
    return fetch('http://localhost:8003/analysis/tasks/', {
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
        dispatch(fillAnalysisTasks(json.message, json.data));
      } else {
        const error = `Status code: ${json.status}; ${json.message}`;
        dispatch(failedGetAnalysisTasks(error));
      }
    })
    .catch((error) => {
      const writeError = typeof error !== 'string' ? 'unknown error' : error;
      dispatch(failedGetAnalysisTasks(writeError));
    });
  };
};
export default getAnalysisTasks;
