const config = require('../../config');
const Grid = require('gridfs-stream');
const mongo = require('mongodb');

const mongoClient = mongo.MongoClient;

const connection = {
  acquire: () => {
    return connection.connection;
  },
  connection: {},
  grid: () => {
    return new Grid(connection.connection, mongo);
  },
  init: () => {
    const url = `mongodb://${config.settings().database.user}:${config.settings().database.readPW}@localhost:27017/${config.settings().database.name}`;
    mongoClient.connect(url, (err, client) => {
      if (!err) {
        connection.connection = client.db(config.settings().database.name);
        console.log(`MongoDB connected, db: ${config.settings().database.name}`);
      } else {
        console.log(err);
        console.log(`Could not connect to database ${config.settings().database.name}`);
      }
    });
  },
};
module.exports = connection;
