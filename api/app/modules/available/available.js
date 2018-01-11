const ArraySort = require('../helpers/sort');
const query = require('../query/query');
const userProjects = require('../projects/user-projects');

const available = {
  // experiments require addition processing to add protocols,
  // hence separate method
  experiment: (queryObj) => {
    return new Promise((resolve, reject) => {
      query.get('experiment', queryObj)
        .then((documents) => {
          const protocolIds = available.getProtocolIds(documents);
          return Promise.all([
            query.get('protocol', { _id: { $in: protocolIds } }),
            documents,
          ]);
        })
        .then((promises) => {
          resolve(available.formatExperiments(promises[1], promises[0]));
        })
        .catch((error) => {
          reject(error);
        })
      ;
    });
  },
  // formatting experiments to add protocols
  formatExperiments: (experiments, protocols) => {
    const formattedExperiments = [];
    experiments.forEach((experiment) => {
      const currExperiment = JSON.parse(JSON.stringify(experiment));
      const currProtocolIds = Object.assign([], currExperiment.protocols);
      currExperiment.fullProtocols = [];
      currProtocolIds.forEach((_id) => {
        const index = protocols.findIndex((protocol) => {
          return protocol._id === _id;
        });
        if (index > -1) {
          currExperiment.fullProtocols.push(protocols[index]);
        } else {
          currExperiment.fullProtocols.push({
            _id,
            name: 'Missing protocol',
          });
        }
      });
      formattedExperiments.push(currExperiment);
    });
    return formattedExperiments;
  },
  // formatting screens to add drug names
  formatScreens: (screens, drugs) => {
    const formattedScreens = [];
    screens.forEach((screen) => {
      const currScreen = JSON.parse(JSON.stringify(screen));
      const currDrugIds = currScreen.drugs ? currScreen.drugs : [];
      currScreen.drugNames = [];
      currDrugIds.forEach((_id) => {
        const index = drugs.findIndex((drug) => {
          return drug._id === _id;
        });
        if (index > -1) {
          currScreen.drugNames.push(drugs[index]);
        } else {
          currScreen.drugNames.push({
            _id,
            name: '-',
          });
        }
      });
      currScreen.drugNames = ArraySort.arrayOfObjectByKeyNumber(currScreen.drugNames, '_id', 'desc');
      formattedScreens.push(currScreen);
    });
    return formattedScreens;
  },
  // entry point for 'getting'
  get: (target, filters, user) => {
    return new Promise((resolve) => {
      let queryFilters;
      if (!filters) {
        queryFilters = {};
      } else if (typeof filters === 'string') {
        queryFilters = JSON.parse(filters);
      } else if (typeof filters === 'object') {
        queryFilters = Object.assign({}, filters);
      } else {
        queryFilters = {};
      }

      // get list of projects the user can query
      let { queryObj, returnObj } = userProjects.query(user);
      query.get('project', queryObj, returnObj)
        .then((projects) => {
          // get array of project IDs the user has not been excluded from
          const filteredProjects = userProjects.filterProjects(user, projects, { project: ['_id'] })
            .map((project) => { return project._id; })
          ;
          // get query and return objects for mongo
          queryObj = available.getFilters(target, user, queryFilters, filteredProjects);
          returnObj = target === 'sample' ? { records: 0 } : {};

          // promise functions
          const resolveGet = (documents) => {
            resolve({
              status: 200,
              clientResponse: {
                status: 200,
                data: documents,
              },
            });
          };
          const rejectGet = (error) => {
            resolve({
              status: 500,
              clientResponse: {
                status: 500,
                message: `There was an error performing this query: ${error}`,
              },
            });
          };

          switch (target) {
            case 'experiment':
              available.experiment(queryObj)
                .then((documents) => {
                  resolveGet(documents);
                })
                .catch((error) => {
                  rejectGet(error);
                })
              ;
              break;
            case 'screen':
              available.screen(queryObj)
                .then((documents) => {
                  resolveGet(documents);
                })
                .catch((error) => {
                  rejectGet(error);
                })
              ;
              break;
            default:
              available.getGeneral(target, queryObj, returnObj)
                .then((documents) => {
                  resolveGet(documents);
                })
                .catch((error) => {
                  rejectGet(error);
                })
              ;
              break;
          }
        })
      ;
    });
  },
  // create object for filtering queries
  getFilters: (target, user, filters, projects) => {
    switch (target) {
      case 'project':
        return { _id: { $in: projects } };
      case 'protocol':
        return { creatorEmail: user.email };
      default:
        return {
          group: projects.includes(filters.project) ? filters : {},
        }
      ;
    }
  },
  // entry point for getting when retrieving information via route (page load)
  getForRoute: (target, user, filters, projects) => {
    return new Promise((resolve, reject) => {
      const queryFilters = filters ? JSON.parse(JSON.stringify(filters)) : {};
      const queryObj = available.getFilters(target, user, queryFilters, projects);
      const returnObj = target === 'sample' ? { records: 0 } : {};

      switch (target) {
        case 'experiment':
          available.experiment(queryObj)
            .then((documents) => {
              resolve(documents);
            })
            .catch((error) => {
              reject(error);
            })
          ;
          break;
        case 'screen':
          available.screen(queryObj)
            .then((documents) => {
              resolve(documents);
            })
            .catch((error) => {
              reject(error);
            })
          ;
          break;
        default:
          available.getGeneral(target, queryObj, returnObj)
            .then((documents) => {
              resolve(documents);
            })
            .catch((error) => {
              reject(error);
            })
          ;
          break;
      }
    });
  },
  getDrugs: (screens) => {
    let drugs = [];
    screens.forEach((screen) => {
      if (screen.drugs) {
        drugs = drugs.concat(screen.drugs);
      }
    });
    return drugs;
  },
  // general get method for retrieving protocols, screen, etc information
  getGeneral: (target, queryObj, returnObj) => {
    return query.get(target, queryObj, returnObj);
  },
  getProtocolIds: (experiments) => {
    let protocols = [];
    experiments.forEach((experiment) => {
      protocols = protocols.concat(experiment.protocols);
    });
    return protocols;
  },
  // screens require addition processing to add drug names,
  // hence separate method
  screen: (queryObj) => {
    return new Promise((resolve, reject) => {
      query.get('screen', queryObj)
        .then((documents) => {
          const drugIds = available.getDrugs(documents);
          return Promise.all([
            query.get('drugs', { _id: { $in: drugIds } }),
            documents,
          ]);
        })
        .then((promises) => {
          resolve(available.formatScreens(promises[1], promises[0]));
        })
        .catch((error) => {
          reject(error);
        })
      ;
    });
  },
};
module.exports = available;
