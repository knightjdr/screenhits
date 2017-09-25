const query = require('../query/query');

const available = {
  get: (target, email, lab, filters) => {
    return new Promise((resolve) => {
      const queryFilters = filters ? JSON.parse(filters) : {};
      const queryObj = available.getFilters(target, email, lab, queryFilters);
      query.get(target, queryObj)
        .then((documents) => {
          resolve({
            status: 200,
            clientResponse: {
              status: 200,
              data: documents,
            },
          });
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
  getFilters: (target, email, lab, filters) => {
    let queryObj;
    if (target === 'project') {
      const queryArr = [
        { creatorEmail: email },
        { ownerEmail: email },
        { $and: [
          { lab },
          {
            permission: {
              $in: ['lr', 'lw'],
            },
          },
        ] },
        {
          permission: {
            $in: ['ar', 'aw'],
          },
        },
      ];
      queryObj = { $or: queryArr };
    } else if (target === 'protocol') {
      queryObj = {};
    } else {
      queryObj = { group: filters };
    }
    return queryObj;
  },
};
module.exports = available;
