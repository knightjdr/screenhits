import storage from '../helpers/storage';

const Token = {
  get: () => {
    if (storage.check()) {
      return storage.get('authToken');
    }
    return null;
  },
};
export default Token;
