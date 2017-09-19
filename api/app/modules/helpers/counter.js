const database = require('../../connections/database');

const Counter = {
  get: (name) => {
    return new Promise((resolve, reject) => {
      database.acquire().collection('counters').findAndModify(
        { _id: name },
        [],
        { $inc: { sequence: 1 } },
        { new: true },
        (err, entry) => {
          if (!err) {
            resolve(entry.value.sequence);
          } else {
            reject(err);
          }
        }
      );
    });
  },
};
module.exports = Counter;
