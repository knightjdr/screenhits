'use strict';

const config = require('../../config');
const mongo = require('mongodb');
const mongoClient = mongo.MongoClient;

const Connection = {
  acquire: () => {
    return Connection.connection;
  },
  connection: {},
  init: () => {
    const url = 'mongodb://' + config.database.user + ':' + config.database.readPW + '@localhost:27017/' + config.database.name;
    mongoClient.connect(url, (err, db) => {
      if(!err) {
        Connection.connection = db;
        console.log('MongoDB connected, db: ' + config.database.name);
      } else {
        console.log(err);
        console.log('Could not connect to database ' + config.database.name);
      }
    });
  }
};
module.exports = Connection;
