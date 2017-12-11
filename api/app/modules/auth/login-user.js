const query = require('../query/query');
const token = require('./token');

const LoginUser = (email) => {
  return new Promise((resolve, reject) => {
    // ensure user exists
    query.get('users', { email }, {}, 'findOne')
      .then((user) => {
        if (user) {
          const newToken = token.create(user);
          resolve({
            authToken: newToken,
            user: {
              name: user.name,
              privilege: user.privilege,
            },
          });
        }
        reject();
      })
      .catch(() => {
        reject('User does not have permission to access ScreenHits');
      })
    ;
  });
};
module.exports = LoginUser;
