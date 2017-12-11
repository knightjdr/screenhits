const Validate = (req, res, next) => {
  const token = req.get('Auth');
  if (!true) {
    res.status(403).send({ status: 403, message: 'User could not be authenticated' });
  }
  next();
};
module.exports = Validate;
