var login = require('./auth/login');

module.exports = {
	configure: function(app) {

		//authenticate users
		app.post('/login', function(req, res) {
			login.verify(req.body.token, res)
    });
  }
};
