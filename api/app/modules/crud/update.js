const config = require('../../../config');
const database = require('../../connections/database');

const Update = {
  insert: (collection, queryObject, updateObject, createIfNotPresent = false) => {
    return new Promise((resolve, reject) => {
      database.acquire(config.settings().database.name)
        .collection(collection)
        .update(queryObject, updateObject, { upsert: createIfNotPresent }, (err) => {
          if (!err) {
            resolve();
          } else {
            reject(`There was an error updaing the ${collection}`);
          }
        })
      ;
    });
  },
  insertMany: (collection, queryField, updateField, insertObj) => {
    return new Promise((resolve, reject) => {
      const next = (array, index) => {
        if (index !== array.length) {
          const queryObj = {};
          queryObj[queryField] = array[index];
          const updateObj = {};
          updateObj[updateField] = { $each: insertObj[array[index]] };
          Update.insert(collection, queryObj, { $push: updateObj }, true)
            .then(() => {
              next(array, index + 1);
            })
            .catch((error) => {
              console.log(error);
              reject(error);
            })
          ;
        } else {
          resolve();
        }
      };
      next(Object.keys(insertObj), 0);
    });
  },
  subField: (collection, queryObj, updateObj, options) => {
    return new Promise((resolve, reject) => {
      database.acquire(config.settings().database.name)
        .collection(collection)
        .update(queryObj, updateObj, options, (err) => {
          if (!err) {
            resolve();
          } else {
            reject(`There was an error updaing the ${collection}`);
          }
        })
      ;
    });
  },
};
module.exports = Update;
