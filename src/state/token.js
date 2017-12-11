import storage from '../helpers/storage';
import updateToken from './set/token-actions';

const Token = {
  clear: () => {
    if (
      !storage.check()
    ) {
      storage.clear('token');
    } else {
      updateToken(null);
    }
  },
  set: (json) => {
    if (
      json.token &&
      !storage.check()
    ) {
      storage.update('token', json.token);
    } else if (
      json.token &&
      storage.check()
    ) {
      updateToken(json.token);
    }
  },
};

export default Token;
