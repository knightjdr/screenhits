var config = require('../../config');
var database = require(config.connectionsDir + config.database.name);
var document = require('../helpers/document');

var Project = {

  add: function(data, res) {
    document.counter('projects', function(err, id) {
      if(err) {
        res.send({status: 1, message: 'There was an error adding this project.'})
      } else {
        data._id = id;
        database.acquire().collection('projects').insert(data, function(err, docs) {
          if(err) {
            res.send({status: 1, message: 'There was an error adding this project.'})
          } else {
            res.send({status: 0, message: 'Project successfully created.', project: docs.ops[0]});
          }
        });
      }
    });
	},

  get: function(data, callback) {
    database.acquire().collection('projects').find(data).toArray(function(err, documents) {
      if(err) {
        callback([]);
      } else {
        if(documents.length > 0) {
          callback(documents);
        } else {
          callback([]);
        }
      }
    })
	}
}
module.exports = Project;
