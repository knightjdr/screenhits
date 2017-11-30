const arrayUnique = require('../helpers/array-unique');
const query = require('../query/query');

const returnFields = {
  experiment: {
    creatorEmail: 0,
    description: 0,
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
    description: 0,
    records: 0,
    type: 0,
  },
  screen: {
    creatorEmail: 0,
    description: 0,
    type: 0,
  },
};

const analysisAvailable = {
  get: (screenType, email) => {
    return new Promise((resolve) => {
      // return object
      const available = {};

      // filter projects to remove user if blocked, and deletes unwanted fields
      const filterProjects = (projects) => {
        const filteredProjects = projects;
        // remove project if user does not have permission
        filteredProjects.forEach((project, index) => {
          const userExclude = project.userPermission.findIndex((user) => {
            return (
              user.email === email &&
              user.permission === 'n'
            );
          });
          if (userExclude > -1) {
            filteredProjects.splice(index, 1);
          }
        });
        // format projects to only return desired fields
        return filteredProjects.map((project) => {
          const newProject = project;
          Object.keys(newProject).forEach((key) => {
            if (!returnFields.project.includes(key)) {
              delete newProject[key];
            }
          });
          return newProject;
        });
      };

      // project search
      const projectQuery = (user) => {
        const queryObj = {
          $or: [
            { creatorEmail: user.email }, // created the project
            { // project is in the same lab
              $and: [
                { lab: user.lab },
                { permission: { $in: ['lr', 'lw'] } },
              ],
            },
            { // anyone can view this project
              $and: [
                { permission: { $in: ['ar', 'aw'] } },
              ],
            },
            { // user has been explicitly added
              userPermission: { $elemMatch: { email: user.email, permission: { $ne: 'n' } } },
            },
          ],
        };
        const returnObj = {};
        return { queryObj, returnObj };
      };

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
      query.get('users', { email }, { _id: 0, email: 1, lab: 1 }, 'findOne')
        .then((user) => {
          // find projects the user can access
          const { queryObj, returnObj } = projectQuery(user);
          return query.get('project', queryObj, returnObj);
        })
        .then((projects) => {
          available.project = filterProjects(projects);
          // find screens matching desired type and available projects
          const projectIDs = available.project.map((project) => { return project._id; });
          const queryObj = {
            $and: [
              { type: screenType },
              { 'group.project': { $in: projectIDs } },
            ],
          };
          return query.get('screen', queryObj, returnFields.screen);
        })
        .then((screens) => {
          available.screen = screens;
          // remove projects with no screens of the desired type
          available.project = removeProjects(available.project, screens);
          // find all experiments and projects in these screens
          const screenIDs = screens.map((screen) => { return screen._id; });
          const queryObj = { 'group.screen': { $in: screenIDs } };
          return Promise.all([
            query.get('experiment', queryObj, returnFields.experiment),
            query.get('sample', queryObj, returnFields.sample),
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
