var config = require('../../config');
var google = require('googleapis');
var plus = google.plus('v1');
var OAuth2 = google.auth.OAuth2;
var oauth2Client = new OAuth2(config.clientID + '.apps.googleusercontent.com');
var database = require(config.connectionsDir + config.database.name);

function Login () {

  this.verify = function(token, res) {
		oauth2Client.setCredentials({
      access_token: token,
		});

		plus.people.get({userId: 'me', auth: oauth2Client}, function(err, response) {
			if(err) {
        res.send({status: 1, message: 'You could not be authenticated by Google.'});
      } else {
        database.acquire().collection('users').findOne({email: response.emails[0].value}, function(err, document) {
          if(err) {
            res.send({status: 1, message: 'There was an error signing you in. Please contact ' +
             '<a class="pointer dark" ng-click="vm.reportError(\'Sign-in failure\')">{{vm.supportName}}</a> for assistance.'});
          } else {
            if(document) {
              res.send({status: 0, user: {email: document.email, name: document.name, permission: document.priveleges, token: token}});
            } else {
              res.send({status: 1, message: 'You do not have access to ScreenHits.'});
            }
          }
        })
      }
		});
	};

}
module.exports = new Login();
