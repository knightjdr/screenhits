const query = require('../query/query');

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
  // entry point for 'getting'
  get: (target, email, lab, filters) => {
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
      const queryObj = available.getFilters(target, email, lab, queryFilters);

      const returnObj = target === 'sample' ? { records: 0 } : {};

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
    });
  },
  // create object for filtering queries
  getFilters: (target, email, lab, filters) => {
    switch (target) {
      case 'project':
        return { $or: [
          { creatorEmail: email },
          { ownerEmail: email },
          { $and: [
            { lab },
            {
              permission: {
                $in: ['lr', 'lw'],
              },
            },
          ] },
          {
            permission: {
              $in: ['ar', 'aw'],
            },
          },
        ] };
      case 'protocol':
        return {};
      default:
        return { group: filters };
    }
  },
  // entry point for getting when retrieving information via route (page load)
  getForRoute: (target, email, lab, filters) => {
    return new Promise((resolve, reject) => {
      const queryFilters = filters ? JSON.parse(JSON.stringify(filters)) : {};
      const queryObj = available.getFilters(target, email, lab, queryFilters);
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
};
module.exports = available;
