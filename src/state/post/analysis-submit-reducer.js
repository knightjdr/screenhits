import {
  FAIL_ANALYSIS_POST,
  REQUEST_ANALYSIS_POST,
  RESET_ANALYSIS_POST,
  SUCCESS_ANALYSIS_POST,
} from './analysis-submit-actions';

const AnalysisPost = (state = {
  didSubmitFail: false,
  isSubmitted: false,
  message: null,
}, action) => {
  switch (action.type) {
    case FAIL_ANALYSIS_POST:
      return Object.assign(
        {},
        state,
        {
          didSubmitFail: true,
          isSubmitted: false,
          message: action.message,
        }
      );
    case REQUEST_ANALYSIS_POST:
      return Object.assign(
        {},
        state,
        {
          didSubmitFail: false,
          isSubmitted: true,
          message: null,
        }
      );
    case RESET_ANALYSIS_POST:
      return Object.assign(
        {},
        state,
        {
          didSubmitFail: false,
          isSubmitted: false,
          message: null,
        }
      );
    case SUCCESS_ANALYSIS_POST:
      return Object.assign(
        {},
        state,
        {
          didSubmitFail: false,
          isSubmitted: false,
          message: action.message,
        }
      );
    default:
      return state;
  }
};
export default AnalysisPost;
