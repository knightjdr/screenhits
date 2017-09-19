const validators = require('../helpers/validators');

const Auth = {
	validate: (req, res, next) => {
		const authArray = req.get('Auth').split(':');
		req.email = authArray[1];
		if (!validators.email(req.email)) {
			res.status(403).send({ status: 403, message: 'Invalid email' });
		}
		req.lab = authArray[2];
		if (!req.lab) {
			res.status(403).send({ status: 403, message: 'Invalid lab name' });
		}
		next();
	},
};
module.exports = Auth;
