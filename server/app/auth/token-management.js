var config = require('../../config');
var database = require(config.connectionsDir + config.database.name);
var randomString = require("randomstring");

var SiteToken = {

	create: function() {
   	return randomString.generate(20);
	},

	revoke: function(user, res) {
		if(user) {
			database.acquire().collection('users').update({email: user.email}, {$set: {token: ''}});
		}
		res.send({});
	},

	set: function(email, token) {
		database.acquire().collection('users').update({email: email}, {$set: {token: token}});
	}

}
module.exports = SiteToken;
