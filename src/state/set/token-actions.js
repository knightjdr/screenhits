import storage from '../../helpers/storage';

export const CLEAR_TOKEN = 'CLEAR_TOKEN';
export const UPDATE_TOKEN = 'UPDATE_TOKEN';

export const clearToken = () => {
  if (
    storage.check()
  ) {
    storage.clear('authToken');
  }
  return {
    type: 'CLEAR_TOKEN',
  };
};

export const updateToken = (authToken) => {
  if (
    authToken &&
    storage.check()
  ) {
    storage.update('authToken', authToken);
    return {
      authToken,
      type: 'UPDATE_TOKEN',
    };
  } else if (
    authToken &&
    !storage.check()
  ) {
    return {
      authToken,
      type: 'UPDATE_TOKEN',
    };
  }
  return {
    type: 'NO_ACTION',
  };
};
