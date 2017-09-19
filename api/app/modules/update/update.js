const format = require('../helpers/format');
const update = require('../crud/update');
const validate = require('../validation/validation');

const Update = {
  put: (obj) => {
    return new Promise((resolve, reject) => {
      const id = obj._id;
      const target = obj.target;
      validate[target](obj, 'update-date')
        .then((newObj) => {
          return update.insert(target, { _id: id }, newObj);
        })
        .then(() => {
          resolve({
            status: 200,
            clientResponse: {
              status: 200,
              message: `${format.uppercaseFirst(target)} ${id} successfully updated`,
            },
          });
        })
        .catch((error) => {
          reject({
            status: 500,
            clientResponse: {
              status: 500,
              message: `There was an error updating this ${target}: ${error}`,
            },
          });
        })
      ;
    });
  },
};
module.exports = Update;
