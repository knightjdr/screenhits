import fetch from 'isomorphic-fetch';

import { updateToken } from '../set/token-actions';

export const FAILED_GET_ANALYSIS_SAMPLES = 'FAILED_GET_ANALYSIS_SAMPLES';
export const FILL_ANALYSIS_SAMPLES = 'FILL_ANALYSIS_SAMPLES';
export const IS_GETTING_ANALYSIS_SAMPLES = 'IS_GETTING_ANALYSIS_SAMPLES';

export const failedGetAnalysisSamples = (error) => {
  return {
    message: error,
    type: 'FAILED_GET_ANALYSIS_SAMPLES',
  };
};

export const fillAnalysisSamples = (message, sampleObj) => {
  return {
    message,
    sampleObj,
    type: 'FILL_ANALYSIS_SAMPLES',
  };
};

export const isGettingAnalysisSamples = () => {
  return {
    type: 'IS_GETTING_ANALYSIS_SAMPLES',
  };
};

// thunks
const getAnalysisSamples = (screenType) => {
  return (dispatch, getState) => {
    dispatch(isGettingAnalysisSamples());
    const headers = new Headers();
    headers.append('Accept', 'application/json');
    headers.append('Auth-Token', getState().token);
    headers.append('Content-Type', 'application/json');
    return fetch(`${process.env.API_ROOT}/analysis/samples?screenType=${screenType}`, {
      cache: 'default',
      headers,
      mode: 'cors',
    })
    .then((response) => {
      return response.json();
    })
    .then((json) => {
      if (json.status === 200) {
        dispatch(updateToken(json.authToken));
        dispatch(fillAnalysisSamples(json.message, json.data));
      } else {
        const error = `Status code: ${json.status}; ${json.message}`;
        dispatch(failedGetAnalysisSamples(error));
      }
    })
    .catch((error) => {
      const writeError = typeof error !== 'string' ? 'unknown error' : error;
      dispatch(failedGetAnalysisSamples(writeError));
    });
  };
};
export default getAnalysisSamples;
