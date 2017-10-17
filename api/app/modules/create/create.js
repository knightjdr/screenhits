const available = require('../available/available');
const create = require('../crud/create');
const counter = require('../helpers/counter');
const moment = require('moment');
const query = require('../query/query');
const readFile = require('./read-file');
const update = require('../crud/update');
const validate = require('../validation/validation');

const Create = {
  experiment: (req) => {
    return new Promise((resolve) => {
      let objCreate = {};
      validate.experiment(req.body, 'creationDate')
        .then((newObj) => {
          objCreate = newObj;
          return counter.get('experiment');
        })
        .then((sequence) => {
          objCreate._id = sequence;
          return create.insert('experiment', objCreate);
        })
        .then(() => {
          const protocolIds = available.getProtocolIds([objCreate]);
          return query.get('protocol', { _id: { $in: protocolIds } });
        })
        .then((protocols) => {
          const formattedObj = available.formatExperiments([objCreate], protocols)[0];
          resolve({
            status: 200,
            clientResponse: {
              status: 200,
              _id: formattedObj._id,
              message: `Screen successfully created with ID ${formattedObj._id}`,
              obj: formattedObj,
            },
          });
        })
        .catch((error) => {
          resolve({
            status: 500,
            clientResponse: {
              status: 500,
              message: `There was an error creating this experiment: ${error}`,
            },
          });
        })
      ;
    });
  },
  project: (req) => {
    return new Promise((resolve) => {
      let objCreate = {};
      validate.project(req.body, 'creationDate')
        .then((newObj) => {
          objCreate = newObj;
          return counter.get('project');
        })
        .then((sequence) => {
          objCreate._id = sequence;
          objCreate.userPermission = [];
          return create.insert('project', objCreate);
        })
        .then(() => {
          resolve({
            status: 200,
            clientResponse: {
              status: 200,
              _id: objCreate._id,
              message: `Project successfully created with ID ${objCreate._id}`,
              obj: objCreate,
            },
          });
        })
        .catch((error) => {
          resolve({
            status: 500,
            clientResponse: {
              status: 500,
              message: `There was an error creating this project: ${error}`,
            },
          });
        })
      ;
    });
  },
  protocol: (req) => {
    return new Promise((resolve) => {
      let objCreate = {};
      validate.protocol(req.body, 'creationDate')
        .then((newObj) => {
          objCreate = newObj;
          return counter.get('protocol');
        })
        .then((sequence) => {
          objCreate._id = sequence;
          return create.insert('protocol', objCreate);
        })
        .then(() => {
          resolve({
            status: 200,
            clientResponse: {
              status: 200,
              _id: objCreate._id,
              message: `Protocol successfully created with ID ${objCreate._id}`,
              obj: objCreate,
            },
          });
        })
        .catch((error) => {
          resolve({
            status: 500,
            clientResponse: {
              status: 500,
              message: `There was an error creating this protocol: ${error}`,
            },
          });
        })
      ;
    });
  },
  processSample: (sample) => {
    return new Promise((resolve, reject) => {
      const objCreate = {};
      validate.sample(sample.body, 'creationDate')
        .then((validatedObj) => {
          return Promise.all([
            counter.get('sample'),
            validatedObj,
          ]);
        })
        .then((data) => {
          objCreate._id = data[0];
          return readFile[data[1].data.type](
            sample.files,
            data[1].data,
            data[1].fileType,
            data[1].header,
            data[1].parser,
            data[0]
          );
        })
        .then((documents) => {
          objCreate.data = documents.sample;
          return Promise.all([
            create.insert('sample', documents.sample),
            update.insertMany('CRISPRgene', 'name', 'records', documents.gene),
            update.insertMany('CRISPRguide', 'sequence', 'records', documents.guide),
          ]);
        })
        .then(() => {
          resolve();
        })
        .catch((error) => {
          reject(error);
        })
      ;
    });
  },
  queue: {
    errors: [],
    finished: [],
    inProgess: false,
    running: [],
  },
  sample: (req) => {
    return new Promise((resolve) => {
      // add to queue
      Create.queue.running.push(req);
      resolve({
        status: 200,
        clientResponse: {
          status: 200,
          _id: null,
          message: `The sample was queued for processing. You can monitor its
          status by clicking the info button at the bottom right.`,
        },
      });
      // if queue isn't running, start it
      if (!Create.queue.inProgress) {
        Create.runQueue();
      }
    });
  },
  runQueue: () => {
    Create.queue.inProgress = true;
    const next = (array) => {
      if (array.length > 0) {
        Create.processSample(array[0])
          .then(() => {
            Create.updateQueue('finished');
            next(Create.queue.running);
          })
          .catch((error) => {
            Create.updateQueue('errors', error);
            next(Create.queue.running);
          })
        ;
      } else {
        Create.queue.inProgress = false;
      }
    };
    next(Create.queue.running);
  },
  screen: (req) => {
    return new Promise((resolve) => {
      let objCreate = {};
      validate.screen(req.body, 'creationDate')
        .then((newObj) => {
          objCreate = newObj;
          return counter.get('screen');
        })
        .then((sequence) => {
          objCreate._id = sequence;
          return create.insert('screen', objCreate);
        })
        .then(() => {
          resolve({
            status: 200,
            clientResponse: {
              status: 200,
              _id: objCreate._id,
              message: `Screen successfully created with ID ${objCreate._id}`,
              obj: objCreate,
            },
          });
        })
        .catch((error) => {
          resolve({
            status: 500,
            clientResponse: {
              status: 500,
              message: `There was an error creating this screen: ${error}`,
            },
          });
        })
      ;
    });
  },
  updateQueue: (type, error) => {
    const runSample = {
      date: moment().format('MMMM Do YYYY, h:mm a'),
      sampleName: Create.queue.running[0].body && Create.queue.running[0].body.name ?
        Create.queue.running[0].body.name
        :
        'unknown sample',
      userName: Create.queue.running[0].body && Create.queue.running[0].body.creatorName ?
        Create.queue.running[0].body.creatorName
        :
        'unknown user',
    };
    if (error) {
      runSample.error = typeof error !== 'string' ? 'unknown error' : error;
    }
    Create.queue[type].unshift(runSample);
    // check if finished or error arrays are too long (> 100)
    if (Create.queue[type].length > 100) {
      Create.queue[type].splice(100, Create.queue[type].length - 100);
    }
    // remove sample from running queue
    Create.queue.running.splice(0, 1);
  },
};
module.exports = Create;
