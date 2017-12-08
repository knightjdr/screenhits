const googleValidate = require('./google/validate-token');
const loginUser = require('./login-user');

const Login = (token) => {
  return new Promise((resolve) => {
    googleValidate(token)
      .then((email) => {
        return loginUser(email);
      })
      .then((user) => {
        resolve({
          status: 200,
          clientResponse: {
            status: 200,
            user: {
              email: user.email,
              lab: user.lab,
              name: user.name,
              privilege: user.privilege,
              token: user.token,
            },
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
