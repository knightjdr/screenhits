const config = require('../../../config');
const database = require('../../connections/database');

const Delete = {
  item: (collection, deleteQuery) => {
    return new Promise((resolve, reject) => {
      database.acquire(config.settings().database.name)
        .collection(collection).remove(deleteQuery, (err) => {
          if (!err) {
            resolve();
          } else {
            reject(`There was an error deleting this ${collection}`);
          }
        })
      ;
    });
  },
};
module.exports = Delete;
