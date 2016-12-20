var config = require('../../config');
var database = require(config.connectionsDir + config.database.name);
var document = require('../helpers/document');

var Screen = {

  add: function(data, res) {
    document.counter('screens', function(err, id) {
      if(err) {
        res.send({status: 1, message: 'There was an error creating this screen.'})
      } else {
        data._id = id;
        data.created = Date.now();
        database.acquire().collection('screens').insert(data, function(err, documents) {
          if(err) {
            res.send({status: 1, message: 'There was an error creating this screen.'})
          } else {
            res.send({status: 0, message: 'Screen successfully created.', screen: documents.ops[0]});
          }
        });
      }
    });
	},

  get: function(data, res) {
    database.acquire().collection('screens').find({project: parseInt(data.project)}).toArray(function(err, documents) {
      if(err) {
        res.send({status: 1, message: 'There was an error retreiving screens for this project.'})
      } else {
        if(documents.length > 0) {
          res.send({status: 0, message: 'Screens successfully retrieved.', screens: documents});
        } else {
          res.send({status: 0, message: 'This project contains no screens.', screens: []});
        }
      }
    })
	}
}
module.exports = Screen;
