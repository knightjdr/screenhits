const available = require('./available');
const query = require('../query/query');

const loadRoute = {
  get: (target, email, lab, selected) => {
    return new Promise((resolve) => {
      const querySelected = selected ? JSON.parse(selected) : {};
      const filters = {
        experiment: {
          project: querySelected.project,
          screen: querySelected.screen,
        },
        project: {},
        sample: {
          project: querySelected.project,
          screen: querySelected.screen,
          experiment: querySelected.experiment,
        },
        screen: {
          project: querySelected.project,
        },
      };
      Promise.all([
        querySelected.project ? available.getFilters('project', email, lab, filters.project) : null,
        querySelected.project ? available.getFilters('screen', email, lab, filters.screen) : null,
        querySelected.screen ? available.getFilters('experiment', email, lab, filters.experiment) : null,
        querySelected.experiment ? available.getFilters('sample', email, lab, filters.sample) : null,
      ])
        .then((queryObject) => {
          return Promise.all([
            querySelected.project ? query.get('project', queryObject[0]) : [],
            querySelected.project ? query.get('screen', queryObject[1]) : [],
            querySelected.screen ? query.get('experiment', queryObject[2]) : [],
            querySelected.experiment ? query.get('sample', queryObject[3]) : [],
          ]);
        })
        .then((availableArray) => {
          resolve({
            status: 200,
            clientResponse: {
              status: 200,
              data: {
                experiment: availableArray[2],
                project: availableArray[0],
                sample: availableArray[3],
                screen: availableArray[1],
              },
            },
          });
        })
        .catch((error) => {
          resolve({
            status: 500,
            clientResponse: {
              status: 500,
              message: `There was an error loading based on the route: ${error}`,
            },
          });
        })
      ;
    });
  },
};
module.exports = loadRoute;
