const query = require('../query/query');
const sort = require('../helpers/sort');

const Search = {
  user: (type, value, res) => {
    const queryObj = {};
    const searchString = `${value}`;
    const re = new RegExp(searchString, 'i');
    queryObj[type] = { $regex: re };
    query.get('users', queryObj, { email: 1, _id: 0, lab: 1, name: 1 })
      .then((documents) => {
        const responseObj = {
          status: 200,
          message: 'Search completed',
          users: sort.arrayOfObjectByKey(documents, 'name'),
        };
        res.send(responseObj);
      })
      .catch((error) => {
        res.status(500).send({ status: 500, message: `There was an error performing this search: ${error}` });
      })
    ;
  },
};
module.exports = Search;
