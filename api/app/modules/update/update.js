const format = require('../helpers/format');
const Permission = require('../permission/permission');
const update = require('../crud/update');
const validate = require('../validation/validation');

const Update = {
  put: (obj, user) => {
    return new Promise((resolve) => {
      const id = obj._id;
      const target = obj.target;

      Promise.all([
        validate.update[target](obj, 'updateDate'),
        Permission.canEdit[target](id, user),
      ])
        .then((values) => {
          return update.insert(target, { _id: id }, values[0]);
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
          resolve({
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
