const query = require('../query/query');
const Permission = require('../permission/permission');
const permissionUpdate = require('./permission-update');
const update = require('../crud/update');
const validate = require('./permission-validate');

const UserPermission = {
  put: (_id, permission, user) => {
    return new Promise((resolve) => {
      Permission.isOwner(_id, user)
        .then(() => {
          return validate.type(permission);
        })
        .then(() => {
          return query.get('project', { _id }, { _id: 0, lab: 1, userPermission: 1 }, 'findOne');
        })
        .then((document) => {
          const userPermission = permissionUpdate[permission](
            document.lab,
            document.userPermission
          );
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
module.exports = UserPermission;
