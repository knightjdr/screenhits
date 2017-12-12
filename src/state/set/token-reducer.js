import {
  CLEAR_TOKEN,
  UPDATE_TOKEN,
} from './token-actions';

const Token = (
  state = null,
  action
) => {
  switch (action.type) {
    case CLEAR_TOKEN:
      return null;
    case UPDATE_TOKEN:
      return action.authToken;
    default:
      return state;
  }
};
export default Token;
