const Login = require('./login');
const TokenLogin = require('./token-login');
const Validate = require('./validate');

const Auth = {
  login: Login,
  tokenLogin: TokenLogin,
  validate: Validate,
};
module.exports = Auth;
