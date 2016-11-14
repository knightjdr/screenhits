var config = require('../../config');
var database = require(config.connectionsDir + config.database.name);
var object = require('../helpers/object');

var User = {

  add: function(data, res) {
    if(object.notEmpty(data.users)) {
      database.acquire().collection('projects').update(
        {_id: data.project},
        {$set: {users: data.users}},
        function(err) {
          if(err) {
            res.send({status: 1, message: 'There was an error adding new users.'})
          } else {
            res.send({status: 0, message: 'User(s) succesfully added.'});
          }
        }
      );
    }
  },

  search: function(data, res) {
    if(object.notEmpty(data)) {
      var regexData = object.regexKeys(data);
      database.acquire().collection('users').find(regexData).toArray(function(err, documents) {
        if(err) {
          res.send({status: 1, message: 'There was an error searching for users.'})
        } else {
          for(var i = 0, iLen = documents.length; i < iLen; i++) {
            if(documents[i]._id) {
              delete documents[i]._id;
            }
            if(documents[i].email) {
              delete documents[i].email;
            }
            if(documents[i].privileges) {
              delete documents[i].privileges;
            }
            if(documents[i].token) {
              delete documents[i].token;
            }
          }
          res.send({status: 0, message: 'Search complete.', users: documents});
        }
      });
    }
    else {
      res.send({status: 1, message: 'Search object is empty.'})
    }
	}
}
module.exports = User;
