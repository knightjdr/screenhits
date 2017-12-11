const query = require('../query/query');
const token = require('./token');

const Logout = (email, currToken) => {
  return new Promise((resolve) => {
    const queryObj = {
      email,
      tokens: currToken,
    };
    query.get('users', queryObj, { tokens: 1 }, 'findOne')
      .then((user) => {
        return token.remove(email, user.tokens, currToken);
      })
      .then(() => {
        resolve({
          status: 200,
          clientResponse: {
            status: 200,
            message: 'User successfully signed out',
          },
        });
      })
      .catch(() => {
        resolve({
          status: 500,
          clientResponse: {
            status: 500,
            message: 'User could not be signed out',
          },
        });
      })
    ;
  });
};
module.exports = Logout;
