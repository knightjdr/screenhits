import fetch from 'isomorphic-fetch';

import { updateToken } from '../set/token-actions';
import { userGet } from '../get/project-user-actions';

export const FAIL_PUT = 'FAIL_BULK_PERMISSION_PUT';
export const REQUEST_PUT = 'REQUEST_BULK_PERMISSION_PUT';
export const RESET_PUT = 'RESET_BULK_PERMISSION_PUT';
export const SUCCESS_PUT = 'SUCCESS_BULK_PERMISSION_PUT';

export const failBulkPermissionPut = (_id, message) => {
  return {
    _id,
    message,
    type: 'FAIL_BULK_PERMISSION_PUT',
  };
};

export const requestBulkPermissionPut = (_id) => {
  return {
    _id,
    type: 'REQUEST_BULK_PERMISSION_PUT',
  };
};

export const resetBulkPermissionPut = () => {
  return {
    type: 'RESET_BULK_PERMISSION_PUT',
  };
};

export const successBulkPermissionPut = (_id, message) => {
  return {
    _id,
    message,
    type: 'SUCCESS_BULK_PERMISSION_PUT',
  };
};

// thunks
const changeBulkPermissionAction = (_id, lab, permission) => {
  return (dispatch, getState) => {
    dispatch(requestBulkPermissionPut(_id));
    const headers = new Headers();
    headers.append('Accept', 'application/json');
    headers.append('Auth-Token', getState().token);
    headers.append('Content-Type', 'application/json');
    return fetch(`${process.env.API_ROOT}/permission/`, {
      body: JSON.stringify({
        _id,
        permission,
      }),
      cache: 'default',
      headers,
      method: 'PUT',
      mode: 'cors',
    })
    .then((response) => {
      return response.json();
    })
    .then((json) => {
      if (json.status === 200) {
        dispatch(updateToken(json.authToken));
        dispatch(successBulkPermissionPut(_id, json.message));
        dispatch(userGet(_id, lab, permission));
      } else {
        const error = `Status code: ${json.status}; ${json.message}`;
        dispatch(failBulkPermissionPut(_id, error));
      }
    })
    .catch((error) => {
      dispatch(failBulkPermissionPut(_id, error));
    });
  };
};
export { changeBulkPermissionAction };
