var config = require('../../config');
var google = require('googleapis');
var plus = google.plus('v1');
var OAuth2 = google.auth.OAuth2;
var oauth2Client = new OAuth2(config.clientID + '.apps.googleusercontent.com');

function Login () {

  this.checkToken = function(token) {

  }

  this.check = function(token, res) {
		oauth2Client.setCredentials({
      access_token: token,
		});

		plus.people.get({userId: 'me', auth: oauth2Client}, function(err, response) {
			if(err) {
        res.send({status: 1, message: 'You could not be authenticated by Google.'});
      } else {
        res.send({status: 0, user: {email: response.emails[0].value, name: response.displayName, permission: 'admin', token: token}});
      }
		});
	};

}
module.exports = new Login();
