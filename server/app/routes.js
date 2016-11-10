var validate = require('./auth/validate');
var login = require('./auth/login');
var project = require('./project/project')
var tokenManagement = require('./auth/token-management');

module.exports = {
	configure: function(app) {

		//authentication interceptor for non-admins
		var authenticate = function(req, res, next) {
			var user = JSON.parse(req.get('user'));
			validate.confirm(user, function(response) {
				if(!response.status) {
					next();
				} else {
				 res.send(response);
				}
			});
		};

		//authenticate users
		app.post('/login', function(req, res) {
			login.verify(req.body.token, res)
    });
		//logout users
		app.post('/logout', function(req, res) {
			tokenManagement.revoke(JSON.parse(req.get('user')), res);
    });

		//project creation
		app.post('/project', authenticate, function(req, res) {
			project.add(req.body, res);
    });
  }
};
