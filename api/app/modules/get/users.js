const query = require('../query/query');
const permissions = require('./user-permission');
const sort = require('../helpers/sort');

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
        const usersWithPermission = permissions.set(permission, lab, users, userExceptions);
        responseObj.users = sort.arrayOfObjectByKey(usersWithPermission, 'name');
        res.send(responseObj);
      })
      .catch((error) => {
        res.status(500).send({ status: 500, message: `There was an error performing this query: ${error}` });
      })
    ;
  },
};
module.exports = Users;
