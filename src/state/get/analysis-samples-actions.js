import fetch from 'isomorphic-fetch';

export const FAILED_GET_ANALYSIS_SAMPLES = 'FAILED_GET_ANALYSIS_SAMPLES';
export const FILL_ANALYSIS_SAMPLES = 'FILL_ANALYSIS_SAMPLES';
export const IS_GETTING_ANALYSIS_SAMPLES = 'IS_GETTING_ANALYSIS_SAMPLES';

export function failedGetAnalysisSamples(error) {
  return {
    message: error,
    type: 'FAILED_GET_ANALYSIS_SAMPLES',
  };
}

export function fillAnalysisSamples(message, sampleObj) {
  return {
    message,
    sampleObj,
    type: 'FILL_ANALYSIS_SAMPLES',
  };
}

export function isGettingAnalysisSamples() {
  return {
    type: 'IS_GETTING_ANALYSIS_SAMPLES',
  };
}

// thunks
const getAnalysisSamples = (user, screenType) => {
  return (dispatch) => {
    dispatch(isGettingAnalysisSamples());
    const headers = new Headers();
    headers.append('Accept', 'application/json');
    headers.append('Auth', `${user.name}:${user.email}:${user.lab}:${user.token}`);
    headers.append('Content-Type', 'application/json');
    return fetch(`http://localhost:8003/analysis-samples?screenType=${screenType}`, {
      cache: 'default',
      headers,
      mode: 'cors',
    })
    .then((response) => {
      return response.json();
    })
    .then((json) => {
      if (json.status === 200) {
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
