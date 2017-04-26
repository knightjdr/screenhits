'use strict';

const query = require('../query/query');

const Available = {
  get: (target, email, lab, res) => {
    const queryArr = [
      {'creator-email': email},
      {'owner-email': email},
      {$and: [
        {'lab': lab},
        {
          'permission': {
            $in: ['lr', 'lw']
          }
        }
      ]},
      {
        'permission': {
          $in: ['ar', 'aw']
        }
      }
    ];
    const queryObj = {$or: queryArr};
    query.get(target, queryObj)
      .then((documents) => {
        res.send({status: 200, data: documents});
      })
      .catch((error) => {
        res.status(500).send({status: 500, message: 'There was an error performing this query: ' + error});
      })
    ;
  }
};
module.exports = Available;
