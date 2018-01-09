const query = require('../query/query');
const Sort = require('../helpers/sort');

const DataSource = {
  species: (name) => {
    return new Promise((resolve) => {
      query.get('species', { $text: { $search: `"${name}"` } }, {})
        .then((matches) => {
          const sortedResults = Sort.arrayOfObjectByKey(matches, 'name');
          resolve({
            status: 200,
            clientResponse: {
              status: 200,
              data: sortedResults,
              message: 'Species string searched',
            },
          });
        })
        .catch((error) => {
          resolve({
            status: 500,
            clientResponse: {
              status: 500,
              message: `There was an error querying the text string ${name}: ${error}`,
            },
          });
        })
      ;
    });
  },
};
module.exports = DataSource;
