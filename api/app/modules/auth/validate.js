const Token = require('./token');

const Validate = (req, res, next) => {
  const authToken = req.get('Auth-Token');
  Token.verify(authToken)
    .then((jwt) => {
      const user = {
        email: jwt.sub,
        lab: jwt.lab,
        name: jwt.name,
        privilege: jwt.permissions,
      };
      res.locals.authToken = Token.create(user);
      res.locals.user = user;
      next();
    })
    .catch(() => {
      res.status(403).send({
        status: 403,
        message: `User could not be authenticated. Either \
        your authentication token is invalid or it has expired. Try logging in from the \
        home page again.`,
      });
    })
  ;
};
module.exports = Validate;
