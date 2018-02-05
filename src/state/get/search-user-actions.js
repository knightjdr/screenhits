import fetch from 'isomorphic-fetch';

import { updateToken } from '../set/token-actions';

export const FAIL_GET = 'FAIL_SEARCH_USER_GET';
export const REQUEST_GET = 'REQUEST_SEARCH_USER_GET';
export const RESET_GET = 'RESET_SEARCH_USER_GET';
export const SUCCESS_GET = 'SUCCESS_SEARCH_USER_GET';

export const failUserSearchGet = (_id, message) => {
  return {
    _id,
    message,
    type: 'FAIL_SEARCH_USER_GET',
  };
};

export const requestUserSearchGet = (_id) => {
  return {
    _id,
    type: 'REQUEST_SEARCH_USER_GET',
  };
};

export const resetUserSearchGet = () => {
  return {
    type: 'RESET_SEARCH_USER_GET',
  };
};

export const successUserSearchGet = (_id, message, list) => {
  return {
    _id,
    list,
    message,
    type: 'SUCCESS_SEARCH_USER_GET',
  };
};

// thunks
const userSearch = (_id, queryString) => {
  return (dispatch, getState) => {
    dispatch(requestUserSearchGet(_id));
    const headers = new Headers();
    headers.append('Accept', 'application/json');
    headers.append('Auth-Token', getState().token);
    headers.append('Content-Type', 'application/json');
    return fetch(`${process.env.API_ROOT}/users?${queryString}`, {
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
        dispatch(successUserSearchGet(_id, json.message, json.users));
      } else {
        const error = `Status code: ${json.status}; ${json.message}`;
        dispatch(failUserSearchGet(_id, error));
      }
    })
    .catch((error) => {
      dispatch(failUserSearchGet(_id, error));
    });
  };
};
export { userSearch };
