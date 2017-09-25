const query = require('../query/query');
const permissionUpdate = require('./permission-update');
const update = require('../crud/update');
const validate = require('./permission-validate');

const Permission = {
  put: (_id, permission) => {
    return new Promise((resolve) => {
      validate.type(permission)
        .then(() => {
          return query.get('project', { _id: Number(_id) }, { _id: 0, lab: 1, userPermission: 1 }, 'findOne');
        })
        .then((document) => {
          const userPermission = permissionUpdate[permission](document.lab, document.userPermission);
          return update.insert('project',
            { _id },
            { $set: {
              permission,
              userPermission,
            },
            }
          );
        })
        .then(() => {
          resolve({
            status: 200,
            clientResponse: {
              status: 200,
              message: 'Update successful',
            },
          });
        })
        .catch((error) => {
          resolve({
            status: 500,
            clientResponse: {
              status: 500,
              message: `There was an error updating permissions: ${error}`,
            },
          });
        })
      ;
    });
  },
};
module.exports = Permission;
