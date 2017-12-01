import {
  FAIL_COMPARISON_POST,
  REQUEST_COMPARISON_POST,
  RESET_COMPARISON_POST,
  SUCCESS_COMPARISON_POST,
} from './comparison-submit-actions';

const Comparison = (state = {
  didSubmitFail: false,
  isSubmitted: false,
  item: {},
  message: null,
}, action) => {
  switch (action.type) {
    case FAIL_COMPARISON_POST:
      return Object.assign(
        {},
        state,
        {
          didSubmitFail: true,
          isSubmitted: false,
          item: {},
          message: action.message,
        }
      );
    case REQUEST_COMPARISON_POST:
      return Object.assign(
        {},
        state,
        {
          didSubmitFail: false,
          isSubmitted: true,
          item: {},
          message: null,
        }
      );
    case RESET_COMPARISON_POST:
      return Object.assign(
        {},
        state,
        {
          didSubmitFail: false,
          isSubmitted: false,
          item: {},
          message: null,
        }
      );
    case SUCCESS_COMPARISON_POST:
      return Object.assign(
        {},
        state,
        {
          didSubmitFail: false,
          isSubmitted: false,
          item: JSON.parse(JSON.stringify(action.item)),
          message: action.message,
        }
      );
    default:
      return state;
  }
};
export default Comparison;
