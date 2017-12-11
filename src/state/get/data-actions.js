import fetch from 'isomorphic-fetch';
import { updateToken } from '../set/token-actions';

import activeLevel from '../../helpers/find-active-level';
import { objectEmpty } from '../../helpers/helpers';
import { routeLoaded } from '../routing/routeload-actions';
import { setIndex } from '../set/index-actions';

export const FILL_DATA = 'FILL_DATA';
export const FILL_FAILED = 'FILL_FAILED';
export const IS_FILLING = 'IS_FILLING';
export const PUSH_DATA = 'PUSH_DATA';

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

export function pushData(obj, target) {
  return {
    obj,
    target,
    type: 'PUSH_DATA',
  };
}

// thunks
const getData = (target, filters, selected, user) => {
  return (dispatch) => {
    dispatch(isFilling(target));
    const headers = new Headers();
    headers.append('Accept', 'application/json');
    headers.append('Auth', `${user.name}:${user.email}:${user.lab}:${user.token}`);
    headers.append('Content-Type', 'application/json');
    let url = `http://localhost:8003/management?target=${target}`;
    if (!objectEmpty(filters)) {
      url = `${url}&filters=${JSON.stringify(filters)}`;
    }
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
        dispatch(fillData(target, json.data));
        // this is so that data can be retrieved and a selected index set via a route.
        // See management-container.js for implementation
        if (
          selected &&
          target !== 'protocol'
        ) {
          const index = selected === -1 ? null : selected;
          dispatch(setIndex(target, index));
        }
      } else {
        const error = `Status code: ${json.status}; ${json.message}`;
        dispatch(fillFailed(target, error));
      }
    })
    .catch((error) => {
      const writeError = typeof error !== 'string' ? 'unknown error' : error;
      dispatch(fillFailed(target, writeError));
    });
  };
};

const getRouteData = (selected, user) => {
  return (dispatch) => {
    Object.keys(selected).forEach((target) => {
      if (target) {
        dispatch(isFilling(target));
      }
    });
    const headers = new Headers();
    headers.append('Accept', 'application/json');
    headers.append('Auth', `${user.name}:${user.email}:${user.lab}:${user.token}`);
    headers.append('Content-Type', 'application/json');
    let url = 'http://localhost:8003/loadRoute?target=management';
    if (!objectEmpty(selected)) {
      url = `${url}&selected=${JSON.stringify(selected)}`;
    }
    return fetch(url, {
      cache: 'default',
      headers,
      mode: 'cors',
    })
    .then((response) => {
      return response.json();
    })
    .then((json) => {
      let setSelected;
      if (json.status === 200) {
        dispatch(updateToken(json.token));
        dispatch(fillData('all', json.data));
        // this is so that data can be retrieved and a selected index set via a route.
        // See management-container.js for implementation
        if (!objectEmpty(selected)) {
          setSelected = activeLevel.checkSelected(selected, json.data);
          dispatch(setIndex('all', setSelected));
        }
      } else {
        const error = `Status code: ${json.status}; ${json.message}`;
        Object.keys(selected).forEach((target) => {
          if (target) {
            dispatch(fillFailed(target, error));
          }
        });
      }
      dispatch(routeLoaded());
    })
    .catch((error) => {
      Object.keys(selected).forEach((target) => {
        if (target) {
          const writeError = typeof error !== 'string' ? 'unknown error' : error;
          dispatch(fillFailed(target, writeError));
        }
      });
      dispatch(routeLoaded());
    });
  };
};
export { getData, getRouteData };
