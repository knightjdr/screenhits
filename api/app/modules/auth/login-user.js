const query = require('../query/query');
const token = require('./token');

const LoginUser = (email) => {
  return new Promise((resolve, reject) => {
    const userDetails = {};
    // ensure user exists
    query.get('users', { email }, {}, 'findOne')
      .then((user) => {
        if (user) {
          userDetails.email = user.email;
          userDetails.lab = user.lab;
          userDetails.name = user.name;
          userDetails.privilege = user.privilege;
          userDetails.token = token.create(user);
          return token.updateExpiredTokens(email, user.tokens, userDetails.token);
        }
        return Promise.reject();
      })
      .then(() => {
        resolve(userDetails);
      })
      .catch(() => {
        reject('User does not have permission to access ScreenHits');
      })
    ;
  });
};
module.exports = LoginUser;
