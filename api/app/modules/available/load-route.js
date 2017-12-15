const available = require('./available');
const query = require('../query/query');
const userProjects = require('../projects/user-projects');

const loadRoute = {
  get: (target, selected, user) => {
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

      // get list of projects the user can query
      const { queryObj, returnObj } = userProjects.query(user);
      query.get('project', queryObj, returnObj)
        .then((projects) => {
          // get array of project IDs the user has not been excluded from
          const filteredProjects = userProjects.filterProjects(user, projects, { project: ['_id'] })
            .map((project) => { return project._id; })
          ;
          return Promise.all([
            querySelected.project ? available.getForRoute('project', user, filters.project, filteredProjects) : [],
            querySelected.project ? available.getForRoute('screen', user, filters.screen, filteredProjects) : [],
            querySelected.screen ? available.getForRoute('experiment', user, filters.experiment, filteredProjects) : [],
            querySelected.experiment ? available.getForRoute('sample', user, filters.sample, filteredProjects) : [],
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
