const config = require('../../config');
const mongo = require('mongodb');

const mongoClient = mongo.MongoClient;

const connection = {
  acquire: () => {
    return connection.connection;
  },
  connection: {},
  init: () => {
    const url = `mongodb://${config.settings().database.user}:${config.settings().database.readPW}@localhost:27017/${config.settings().database.name}`;
    mongoClient.connect(url, (err, db) => {
      if (!err) {
        connection.connection = db;
        console.log(`MongoDB connected, db: ${config.settings().database.name}`);
      } else {
        console.log(err);
        console.log(`Could not connect to database ${config.settings().database.name}`);
      }
    });
  },
};
module.exports = connection;
