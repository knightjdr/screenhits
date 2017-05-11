const query = require('../query/query');
const owner = require('./user-owner');
const permissions = require('./user-permission');
const sort = require('../helpers/sort');
const update = require('../crud/update');
const validate = require('./user-validate');

const Users = {
  get: (_id, lab, permission, res) => {
    let userExceptions = [];
    const queryObj = {};
    if (permission === 'lr' || permission === 'lw') {
      queryObj.lab = lab;
    }
    const returnObj = {
      email: 1,
      lab: 1,
      name: 1,
    };
    const responseObj = {
      message: 'Data successfully retrieved',
      status: 200,
    };
    query.get('project', { _id: Number(_id) }, {}, 'findOne')
      .then((document) => {
        responseObj['creator-email'] = document['creator-email'];
        responseObj['creator-name'] = document['creator-name'];
        responseObj['owner-email'] = document['owner-email'];
        responseObj['owner-name'] = document['owner-name'];
        if (document['user-permission'] && document['user-permission'].length > 0) {
          userExceptions = document['user-permission'];
        }
        return permission === 'n' ? [] : query.get('users', queryObj, returnObj);
      })
      .then((users) => {
        const usersWithPermission = permissions.set(
          permission,
          lab,
          users,
          userExceptions,
          responseObj['owner-email']
        );
        responseObj.users = sort.arrayOfObjectByKey(usersWithPermission, 'name');
        const ownerIndex = responseObj.users.findIndex((obj) => { return obj.email === responseObj['owner-email']; });
        const ownerObj = responseObj.users.splice(ownerIndex, 1)[0];
        responseObj.users.unshift(ownerObj);
        res.send(responseObj);
      })
      .catch((error) => {
        res.status(500).send({ status: 500, message: `There was an error performing this query: ${error}` });
      })
    ;
  },
  post: {
    current: (_id, list, res) => {
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
          insertObj['user-permission'] = updateObj;
          return update.insert('project', { _id }, { $set: insertObj });
        })
        .then(() => {
          res.send({ status: 200, message: 'Update successful' });
        })
        .catch((error) => {
          res.status(500).send({ status: 500, message: `There was an error performing this update: ${error}` });
        })
      ;
    },
  },
  put: (_id, users, res) => {
    validate.userArray(users)
      .then(() => {
        return query.get('project', { _id: Number(_id) }, { _id: 0, 'user-permission': 1 }, 'findOne');
      })
      .then((document) => {
        const updateInfo = owner.check(users);
        const userPermission = document['user-permission'];
        updateInfo.arr.forEach((user) => {
          const index = userPermission.findIndex((obj) => { return obj.email === user.email; });
          if (index > -1) {
            userPermission.splice(index, 1);
          }
          userPermission.push(user);
        });
        const insertObj = {};
        if (updateInfo.owner) {
          insertObj['owner-email'] = updateInfo.owner.email;
          insertObj['owner-name'] = updateInfo.owner.name;
          const ownerIndex = userPermission.findIndex((obj) => {
            return obj.email === updateInfo.owner.email;
          });
          if (ownerIndex > -1) {
            userPermission.splice(ownerIndex, 1);
          }
        }
        insertObj['user-permission'] = userPermission;
        return update.insert('project', { _id }, { $set: insertObj });
      })
      .then(() => {
        res.send({ status: 200, message: 'Update successful' });
      })
      .catch((error) => {
        res.status(500).send({ status: 500, message: `There was an error adding users: ${error}` });
      })
    ;
  },
};
module.exports = Users;
