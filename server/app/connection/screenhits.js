var config = require('../../config');
var mongoClient = require('mongodb').MongoClient;

function Connection() {

  var database;

  this.init = function() {
    var url = 'mongodb://' + config.database.name + ':' + config.database.readPW + '@localhost:27017/' + config.database.name
    mongoClient.connect(url, function(err, db) {
      if(!err) {
        database = db;
        console.log('MongoDB connected');
      } else {
        console.log('Could not connect to database');
      }
    });
  };

  this.acquire = function() {
    return database;
  };
}
module.exports = new Connection();
