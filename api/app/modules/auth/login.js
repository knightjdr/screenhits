const googleValidate = require('./google/validate-token');
const loginUser = require('./login-user');

const Login = (token, res) => {
  return new Promise((resolve) => {
    googleValidate(token)
      .then((email) => {
        return loginUser(email);
      })
      .then(({ authToken, user }) => {
        res.locals.token = authToken;
        resolve({
          status: 200,
          clientResponse: {
            status: 200,
            user,
          },
        });
      })
      .catch((error) => {
        resolve({
          status: 403,
          clientResponse: {
            status: 403,
            message: error,
          },
        });
      })
    ;
  });
};
module.exports = Login;
