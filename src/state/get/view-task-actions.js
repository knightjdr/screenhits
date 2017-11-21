import fetch from 'isomorphic-fetch';

export const FAILED_GET_VIEW_TASK = 'FAILED_GET_VIEW_TASK';
export const FILL_VIEW_TASK = 'FILL_VIEW_TASK';
export const IS_GETTING_VIEW_TASK = 'IS_GETTING_VIEW_TASK';

export function failedGetViewTask(error) {
  return {
    message: error,
    type: 'FAILED_GET_VIEW_TASK',
  };
}

export function fillViewTask(message, task) {
  return {
    message,
    task,
    type: 'FILL_VIEW_TASK',
  };
}

export function isGettingViewTask() {
  return {
    type: 'IS_GETTING_VIEW_TASK',
  };
}

// thunks
const getViewTask = (id, user) => {
  return (dispatch) => {
    dispatch(isGettingViewTask());
    const headers = new Headers();
    headers.append('Accept', 'application/json');
    headers.append('Auth', `${user.name}:${user.email}:${user.lab}:${user.token}`);
    headers.append('Content-Type', 'application/json');
    return fetch(`http://localhost:8003/view/task/${id}`, {
      cache: 'default',
      headers,
      mode: 'cors',
    })
    .then((response) => {
      return response.json();
    })
    .then((json) => {
      if (json.status === 200) {
        dispatch(fillViewTask(json.message, json.data));
      } else {
        const error = `Status code: ${json.status}; ${json.message}`;
        dispatch(failedGetViewTask(error));
      }
    })
    .catch((error) => {
      const writeError = typeof error !== 'string' ? 'unknown error' : error;
      dispatch(failedGetViewTask(writeError));
    });
  };
};
export default getViewTask;
