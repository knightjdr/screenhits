const query = require('../query/query');
const owner = require('./user-owner');
const Permission = require('../permission/permission');
const permissions = require('./user-permission');
const sort = require('../helpers/sort');
const update = require('../crud/update');
const validate = require('./user-validate');

const Users = {
  get: (_id, lab, permission, user) => {
    return new Promise((resolve) => {
      const responseObj = {
        status: 200,
        clientResponse: {
          status: 200,
          message: 'Data successfully retrieved',
        },
      };
      let userExceptions = [];
      Permission.isOwner(_id, user)
        .then(() => {
          return query.get('project', { _id }, {}, 'findOne');
        })
        .then((project) => {
          responseObj.clientResponse.creatorEmail = project.creatorEmail;
          responseObj.clientResponse.creatorName = project.creatorName;
          responseObj.clientResponse.ownerEmail = project.ownerEmail;
          responseObj.clientResponse.ownerName = project.ownerName;
          if (
            project.userPermission &&
            project.userPermission.length > 0
          ) {
            userExceptions = project.userPermission;
          }
          const queryObj = Users.getQueryObj(project.ownerEmail, lab, permission);
          return query.get('users', queryObj, { email: 1, lab: 1, name: 1 });
        })
        .then((users) => {
          responseObj.clientResponse.users = Users.getFormatUsers(
            permission,
            lab,
            users,
            userExceptions,
            responseObj.clientResponse.ownerEmail
          );
          resolve(responseObj);
        })
        .catch((error) => {
          resolve({
            status: 500,
            clientResponse: {
              status: 500,
              message: `There was an error performing this query: ${error}`,
            },
          });
        })
      ;
    });
  },
  getFormatUsers: (permission, lab, users, userExceptions, ownerEmail) => {
    const usersWithPermission = permissions.set(permission, lab, users, userExceptions, ownerEmail);
    const usersArr = sort.arrayOfObjectByKey(usersWithPermission, 'name');
    const ownerIndex = usersArr.findIndex((obj) => { return obj.email === ownerEmail; });
    const ownerObj = usersArr.splice(ownerIndex, 1)[0];
    usersArr.unshift(ownerObj);
    return usersArr;
  },
  getQueryObj: (email, lab, permission) => {
    const queryObj = {};
    if (
      permission === 'lr' ||
      permission === 'lw'
    ) {
      queryObj.lab = lab;
    } else if (
      permission === 'n'
    ) {
      queryObj.email = email;
    }
    return queryObj;
  },
  post: {
    current: (_id, list, user) => {
      return new Promise((resolve) => {
        Permission.isOwner(_id, user)
          .then(() => {
            return validate.userArray(list);
          })
          .then(() => {
            const updateObj = list.map((projectUser) => {
              const newUser = projectUser;
              delete newUser._id;
              return newUser;
            });
            const ownerIndex = updateObj.findIndex((obj) => { return obj.permission === 'o'; });
            updateObj.splice(ownerIndex, 1);
            const insertObj = {};
            insertObj.userPermission = updateObj;
            return update.insert('project', { _id }, { $set: insertObj });
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
                message: `There was an error performing this update: ${error}`,
              },
            });
          })
        ;
      });
    },
  },
  put: (_id, users, user) => {
    return new Promise((resolve) => {
      Permission.isOwner(_id, user)
        .then(() => {
          return validate.userArray(users);
        })
        .then(() => {
          return query.get('project', { _id: Number(_id) }, { _id: 0, userPermission: 1 }, 'findOne');
        })
        .then((document) => {
          const updateInfo = owner.check(users);
          const userPermission = document.userPermission;
          updateInfo.arr.forEach((currUser) => {
            const index = userPermission.findIndex((obj) => {
              return obj.email === currUser.email;
            });
            if (index > -1) {
              userPermission.splice(index, 1);
            }
            userPermission.push(currUser);
          });
          const insertObj = {};
          if (updateInfo.owner) {
            insertObj.ownerEmail = updateInfo.owner.email;
            insertObj.ownerName = updateInfo.owner.name;
            const ownerIndex = userPermission.findIndex((obj) => {
              return obj.email === updateInfo.owner.email;
            });
            if (ownerIndex > -1) {
              userPermission.splice(ownerIndex, 1);
            }
          }
          insertObj.userPermission = userPermission;
          return update.insert('project', { _id }, { $set: insertObj });
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
              message: `There was an error adding users: ${error}`,
            },
          });
        })
      ;
    });
  },
};
module.exports = Users;
