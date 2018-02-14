const escapeStringRegexp = require('escape-string-regexp');
const query = require('../query/query');
const Sort = require('../helpers/sort');
const StringScore = require('../helpers/string-score');

const DataSource = {
  cells: (name) => {
    return new Promise((resolve) => {
      // calculate text search score
      const textMatch = (matches) => {
        const arrWithScores = matches.map((matchedTerm) => {
          return Object.assign(
            {},
            matchedTerm,
            {
              score: StringScore(matchedTerm.name, name),
            }
          );
        });
        const sorted = Sort.arrayOfObjectByKeyNumber(arrWithScores, 'score', 'desc');
        // add _id to name because some cell lines have the same name
        return sorted.map((cell) => {
          return Object.assign(
            {},
            cell,
            {
              name: `${cell.name}; ${cell._id}`,
            }
          );
        });
      };

      if (!name) {
        resolve({
          status: 200,
          clientResponse: {
            status: 200,
            data: [],
            message: 'Species string searched',
          },
        });
      } else {
        const escapedString = escapeStringRegexp(name);
        const re = new RegExp(`^${escapedString}`, 'i');
        query.get('cells', { name: { $regex: re } }, { })
          .then((matches) => {
            const sortedResults = textMatch(matches);
            resolve({
              status: 200,
              clientResponse: {
                status: 200,
                data: sortedResults,
                message: 'Cell string searched',
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
      }
    });
  },
  species: (name) => {
    return new Promise((resolve) => {
      // calculate text search score
      const textMatch = (matches) => {
        const arrWithScores = matches.map((matchedTerm) => {
          return Object.assign(
            {},
            matchedTerm,
            {
              score: StringScore(matchedTerm.name, name),
            }
          );
        });
        return Sort.arrayOfObjectByKeyNumber(arrWithScores, 'score', 'desc');
      };

      if (!name) {
        resolve({
          status: 200,
          clientResponse: {
            status: 200,
            data: [],
            message: 'Species string searched',
          },
        });
      } else {
        const escapedString = escapeStringRegexp(name);
        const re = new RegExp(`^${escapedString}`, 'i');
        query.get('species', { name: { $regex: re } }, { })
          .then((matches) => {
            const sortedResults = textMatch(matches);
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
      }
    });
  },
};
module.exports = DataSource;
