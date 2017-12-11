import storage from '../../helpers/storage';

export const CLEAR_TOKEN = 'CLEAR_TOKEN';
export const UPDATE_TOKEN = 'UPDATE_TOKEN';

export const clearToken = () => {
  if (
    storage.check()
  ) {
    storage.clear('token');
  }
  return {
    type: 'CLEAR_TOKEN',
  };
};

export const updateToken = (token) => {
  if (
    token &&
    storage.check()
  ) {
    storage.update('token', token);
  } else if (
    token &&
    !storage.check()
  ) {
    return {
      token,
      type: 'UPDATE_TOKEN',
    };
  }
  return {
    type: 'NO_ACTION',
  };
};
