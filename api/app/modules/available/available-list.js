const query = require('../query/query');
const userProjects = require('../projects/user-projects');

const returnFields = {
  experiment: {
    creatorEmail: 0,
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
    properties: 0,
    records: 0,
  },
  screen: {
    creatorEmail: 0,
  },
};

const availableList = {
  // entry point for 'getting'
  get: (target, user) => {
    return new Promise((resolve) => {
      // format items for return
      const formatItems = (items, level) => {
        switch (level) {
          case 'experiment':
            return items.map((item) => {
              const newItem = item;
              newItem.project = item.group.project;
              newItem.screen = item.group.screen;
              newItem.parents = `P-${newItem.project}, S-${newItem.screen}`;
              return newItem;
            });
          case 'project':
            return items;
          case 'sample':
            return items.map((item) => {
              const newItem = item;
              newItem.experiment = item.group.experiment;
              newItem.project = item.group.project;
              newItem.screen = item.group.screen;
              newItem.parents = `P-${newItem.project}, S-${newItem.screen}, E-${newItem.experiment}`;
              return newItem;
            });
          case 'screen':
            return items.map((item) => {
              const newItem = item;
              newItem.project = item.group.project;
              newItem.parents = `P-${newItem.project}`;
              return newItem;
            });
          default:
            return items;
        }
      };

      const { queryObj, returnObj } = userProjects.query(user);
      query.get('project', queryObj, returnObj)
        .then((projects) => {
          const filteredProjects = userProjects.filterProjects(user, projects, returnFields);
          // find screens matching desired type and available projects
          const projectIDs = filteredProjects.map((project) => { return project._id; });
          const queryObjCurr = {
            $and: [
              { 'group.project': { $in: projectIDs } },
            ],
          };
          return target !== 'project' ?
            query.get(target, queryObjCurr, returnFields[target])
            :
            filteredProjects
          ;
        })
        .then((items) => {
          resolve({
            status: 200,
            clientResponse: {
              status: 200,
              data: formatItems(items, target),
              message: `${target} list successfully retrieved`,
            },
          });
        })
        .catch((error) => {
          resolve({
            status: 500,
            clientResponse: {
              status: 500,
              message: `There was an error retrieving the ${target} list: ${error}`,
            },
          });
        })
      ;
    });
  },
};
module.exports = availableList;
