const googleValidate = require('./google/validate-token');
const loginUser = require('./login-user');

const Login = (signinToken, res) => {
  return new Promise((resolve) => {
    googleValidate(signinToken)
      .then((email) => {
        return loginUser(email.toLowerCase());
      })
      .then(({ authToken, user }) => {
        res.locals.authToken = authToken;
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
