const validators = require('../helpers/validators');

const Validate = (req, res, next) => {
  const authArray = req.get('Auth').split(':');
  req.email = authArray[1];
  if (!validators.email(req.email)) {
    res.status(403).send({ status: 403, message: 'User could not be authenticated' });
  }
  next();
};
module.exports = Validate;
