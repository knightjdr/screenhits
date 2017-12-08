const Login = require('./login');
const Logout = require('./logout');
const Validate = require('./validate');

const Auth = {
  login: Login,
  logout: Logout,
  validate: Validate,
};
module.exports = Auth;
