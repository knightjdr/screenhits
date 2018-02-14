const config = require('../../../config');
const database = require('../../connections/database');

const Query = {
  get: (collection, queryObject = {}, returnObject = {}, method = 'find') => {
    return new Promise((resolve, reject) => {
      if (method === 'find') {
        const db = database.acquire(config.settings().database.name);
        db.collection(collection)
          .find(queryObject, returnObject)
          .toArray((err, documents) => {
            if (!err) {
              resolve(documents);
            } else {
              reject(`there was an error retrieving data for ${collection} collection`);
            }
          })
        ;
      } else {
        const db = database.acquire(config.settings().database.name);
        db.collection(collection)
          .findOne(queryObject, returnObject, (err, document) => {
            if (!err) {
              resolve(document);
            } else {
              reject(`there was an error retrieving data for ${collection} collection`);
            }
          })
        ;
      }
    });
  },
};
module.exports = Query;
