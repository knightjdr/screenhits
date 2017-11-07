import {
  FAILED_GET_ANALYSIS_SAMPLES,
  FILL_ANALYSIS_SAMPLES,
  IS_GETTING_ANALYSIS_SAMPLES,
} from './analysis-samples-actions';

const emptyItems = {
  experiment: [],
  project: [],
  sample: [],
  screen: [],
};

const AnalysisAvailable = (state = {
  didInvalidate: false,
  isFetching: false,
  items: JSON.parse(JSON.stringify(emptyItems)),
  message: null,
}, action) => {
  switch (action.type) {
    case FAILED_GET_ANALYSIS_SAMPLES:
      return Object.assign(
        {},
        state,
        {
          didInvalidate: true,
          isFetching: false,
          items: JSON.parse(JSON.stringify(emptyItems)),
          message: action.message,
        }
      );
    case FILL_ANALYSIS_SAMPLES:
      return Object.assign(
        {},
        state,
        {
          didInvalidate: false,
          isFetching: false,
          items: action.sampleObj,
          message: action.message,
        }
      );
    case IS_GETTING_ANALYSIS_SAMPLES:
      return Object.assign(
        {},
        state,
        {
          didInvalidate: false,
          isFetching: true,
          items: JSON.parse(JSON.stringify(emptyItems)),
          message: null,
        }
      );
    default:
      return state;
  }
};
export default AnalysisAvailable;
