const arrayUnique = require('../helpers/array-unique');
const query = require('../query/query');
const userProjects = require('../projects/user-projects');

const returnFields = {
  experiment: {
    creatorEmail: 0,
    group: 0,
    protocols: 0,
  },
  project: [
    '_id',
    'comment',
    'creationDate',
    'creatorName',
    'lab',
    'name',
  ],
  sample: {
    creatorEmail: 0,
    records: 0,
    type: 0,
  },
  screen: {
    creatorEmail: 0,
    type: 0,
  },
};

const analysisAvailable = {
  get: (screenType, user) => {
    return new Promise((resolve) => {
      // return object
      const available = {};

      // remove projects with not screens of desired type
      const removeProjects = (projects, screens) => {
        const keepProjects = arrayUnique(
          screens.map((screen) => {
            return screen.group.project;
          })
        );
        const newProjects = projects;
        newProjects.forEach((project, index) => {
          if (!keepProjects.includes(project._id)) {
            newProjects.splice(index, 1);
          }
        });
        return newProjects;
      };

      // get user info
      const { queryObj, returnObj } = userProjects.query(user);
      query.get('project', queryObj, returnObj)
        .then((projects) => {
          available.project = userProjects.filterProjects(user.email, projects, returnFields);
          // find screens matching desired type and available projects
          const projectIDs = available.project.map((project) => { return project._id; });
          const queryObjCurr = {
            $and: [
              { type: screenType },
              { 'group.project': { $in: projectIDs } },
            ],
          };
          return query.get('screen', queryObjCurr, returnFields.screen);
        })
        .then((screens) => {
          available.screen = screens;
          // remove projects with no screens of the desired type
          available.project = removeProjects(available.project, screens);
          // find all experiments and projects in these screens
          const screenIDs = screens.map((screen) => { return screen._id; });
          const queryObjCurr = { 'group.screen': { $in: screenIDs } };
          return Promise.all([
            query.get('experiment', queryObjCurr, returnFields.experiment),
            query.get('sample', queryObjCurr, returnFields.sample),
          ]);
        })
        .then((values) => {
          available.experiment = values[0];
          available.sample = values[1];
          resolve({
            status: 200,
            clientResponse: {
              status: 200,
              data: available,
              message: 'Samples successfully retrieved',
            },
          });
        })
        .catch((error) => {
          resolve({
            status: 500,
            clientResponse: {
              status: 500,
              message: `There was an error retrieving samples information: ${error}`,
            },
          });
        })
      ;
    });
  },
};
module.exports = analysisAvailable;
