var config = require('../../config');
var database = require(config.connectionsDir + config.database.name);
var document = require('../helpers/document');

var Protocol = {

  get: function(data, res) {
    database.acquire().collection('protocols').find({$or: [{creator: data.user}, {project: parseInt(data.project)}]}).toArray(function(err, documents) {
      if(err) {
        res.send({status: 1, message: 'There was an error retrieving your protocols.'})
      } else {
        if(documents.length > 0) {
          var protocols = documents;
          for(var i = protocols.length - 1; i >= 0; i--) {
            if(protocols[i].access === "private" ) {
              protocols.splice(i);
            }
          }
          res.send({status: 0, message: 'Protocols retrieved.', protocols: protocols});
        } else {
          res.send({status: 0, message: 'You have not created and do not have access to any existing protocols.'});
        }
      }
    })
	}
}
module.exports = Protocol;
