const query = require('../query/query');
const sort = require('../helpers/sort');
const typeCheck = require('../helpers/type-check');

const Search = {
  user: (type, value) => {
    return new Promise((resolve, reject) => {
      typeCheck.string(value)
        .then(() => {
          const queryObj = {};
          const searchString = `${value}`;
          const re = new RegExp(searchString, 'i');
          queryObj[type] = { $regex: re };
          return query.get('users', queryObj, { email: 1, _id: 0, lab: 1, name: 1 });
        })
        .then((documents) => {
          const responseObj = {
            status: 200,
            clientResponse: {
              status: 200,
              message: 'Search completed',
              users: sort.arrayOfObjectByKey(documents, 'name'),
            },
          };
          resolve(responseObj);
        })
        .catch((error) => {
          reject({
            status: 500,
            clientResponse: {
              status: 500,
              message: `There was an error performing this search: ${error}`,
            },
          });
        })
      ;
    });
  },
};
module.exports = Search;
