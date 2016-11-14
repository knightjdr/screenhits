var validate = require('./auth/validate');
var login = require('./auth/login');
var project = require('./project/project')
var tokenManagement = require('./auth/token-management');
var user = require('./user/user')

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
		//user search
		app.get('/project/users', authenticate, function(req, res) {
			user.search(req.query, res);
		});
		//user addition to project
		app.post('/project/users', authenticate, function(req, res) {
			user.add(req.body, res);
		});

		//project creation
		app.post('/project', authenticate, function(req, res) {
			project.add(req.body, res);
    });
  }
};
