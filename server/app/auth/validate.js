var config = require('../../config');
var database = require(config.connectionsDir + config.database.name);

var Validate = {

  confirm: function(user, callback) {
    if(user.email && user.token) {
      database.acquire().collection('users').findOne({email: user.email, token: user.token}, function(err, document) {
        if(err) {
          callback({status: 1, message: 'There was an error connecting to the database.'});
        } else {
          if(document) {
            callback({status: 0});
          } else {
            callback({status: 1, message: 'You do not have permission to perform this function.'});
          }
        }
  		});
    } else {
      callback({status: 1, message: 'You do not have permission to perform this function.'});
    }
	}
}
module.exports = Validate;
