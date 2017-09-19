const config = require('../../../config');
const database = require('../../connections/database');

const Create = {
  insert: (collection, createObject) => {
    return new Promise((resolve, reject) => {
      database.acquire(config.settings().database.name)
        .collection(collection).insert(createObject, (err) => {
          if (!err) {
            resolve();
          } else {
            reject(`There was an error adding the ${collection} to the database`);
          }
        })
      ;
    });
  },
};
module.exports = Create;
