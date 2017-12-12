const available = require('./available');

const loadRoute = {
  get: (target, user, selected) => {
    return new Promise((resolve) => {
      const querySelected = selected ? JSON.parse(selected) : {};
      const filters = {
        experiment: {
          project: querySelected.project,
          screen: querySelected.screen,
        },
        project: {},
        sample: {
          experiment: querySelected.experiment,
          project: querySelected.project,
          screen: querySelected.screen,
        },
        screen: {
          project: querySelected.project,
        },
      };
      Promise.all([
        querySelected.project ? available.getForRoute('project', user.email, user.lab, filters.project) : [],
        querySelected.project ? available.getForRoute('screen', user.email, user.lab, filters.screen) : [],
        querySelected.screen ? available.getForRoute('experiment', user.email, user.lab, filters.experiment) : [],
        querySelected.experiment ? available.getForRoute('sample', user.email, user.lab, filters.sample) : [],
      ])
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
