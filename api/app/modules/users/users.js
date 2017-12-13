const query = require('../query/query');
const owner = require('./user-owner');
const permissions = require('./user-permission');
const sort = require('../helpers/sort');
const update = require('../crud/update');
const validate = require('./user-validate');

const Users = {
  get: (_id, lab, permission, user) => {
    return new Promise((resolve) => {
      const queryObj = Users.getQueryObj(lab, permission);
      const responseObj = {
        status: 200,
        clientResponse: {
          status: 200,
          message: 'Data successfully retrieved',
        },
      };
      let userExceptions = [];
      query.get('project', { _id: Number(_id) }, {}, 'findOne')
        .then((document) => {
          responseObj.clientResponse.creatorEmail = document.creatorEmail;
          responseObj.clientResponse.creatorName = document.creatorName;
          responseObj.clientResponse.ownerEmail = document.ownerEmail;
          responseObj.clientResponse.ownerName = document.ownerName;
          if (
            document.userPermission &&
            document.userPermission.length > 0
          ) {
            userExceptions = document.userPermission;
          }
          return permission === 'n' ? [] :
            query.get(
              'users',
              queryObj,
              {
                email: 1,
                lab: 1,
                name: 1,
              }
            )
          ;
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
  getQueryObj: (lab, permission) => {
    const queryObj = {};
    if (
      permission === 'lr' ||
      permission === 'lw'
    ) {
      queryObj.lab = lab;
    }
    return queryObj;
  },
  post: {
    current: (_id, list, user) => {
      return new Promise((resolve) => {
        validate.userArray(list)
          .then(() => {
            const updateObj = list.map((user) => {
              const newUser = user;
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
      validate.userArray(users)
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
