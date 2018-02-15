const available = require('../available/available');
const imageConvert = require('../images/convert');
const counter = require('../helpers/counter');
const create = require('../crud/create');
const deleteSample = require('../delete/delete').sample();
const moment = require('moment');
const Permission = require('../permission/permission');
const query = require('../query/query');
const readFile = require('./read-file');
const storeImage = require('../images/store-image');
// const update = require('../crud/update');
const validate = require('../validation/validation');

const Create = {
  experiment: (req, user) => {
    return new Promise((resolve) => {
      let objCreate = {};
      Promise.all([
        validate.create.experiment(req.body, 'creationDate', user),
        Permission.canEdit.project(req.body.project, user),
      ])
        .then((values) => {
          objCreate = values[0];
          return Promise.all([
            counter.get('experiment'),
            query.get('screen', { _id: objCreate.group.screen }, { type: 1 }, 'findOne'),
          ]);
        })
        .then((values) => {
          objCreate._id = values[0];
          objCreate.type = values[1].type;
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
  microscopy: (sample) => {
    return new Promise((resolve) => {
      let objCreate = {};
      Promise.all([
        validate.create.microscopy(sample.body, 'creationDate', sample.user),
        Permission.canEdit.project(sample.body.project, sample.user),
      ])
        .then((values) => {
          objCreate = values[0];
          return imageConvert.toPNG(sample.files.file);
        })
        .then((image) => {
          const filename = sample.files.file.name.replace(/\.[^/.]+$/, '');
          return Promise.all([
            counter.get('sample'),
            storeImage.image(image, { project: Number(sample.body.project) }, `${filename}.png`),
          ]);
        })
        .then((values) => {
          // add new id
          objCreate._id = values[0];
          objCreate.files_id = values[1];
          return create.insert('sample', objCreate);
        })
        .then(() => {
          resolve({
            status: 200,
            clientResponse: {
              status: 200,
              _id: objCreate._id,
              message: `Sample successfully created with ID ${objCreate._id}`,
              obj: objCreate,
            },
          });
        })
        .catch((error) => {
          resolve({
            status: 500,
            clientResponse: {
              status: 500,
              message: `There was an error creating this sample: ${error}`,
            },
          });
        })
      ;
    });
  },
  project: (req, user) => {
    return new Promise((resolve) => {
      let objCreate = {};
      validate.create.project(req.body, 'creationDate', user)
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
  protocol: (req, user) => {
    return new Promise((resolve) => {
      let objCreate = {};
      validate.create.protocol(req.body, 'creationDate', user)
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
      Promise.all([
        validate.create.sample(sample.body, 'creationDate', sample.user),
        Permission.canEdit.project(sample.body.project, sample.user),
      ])
        .then((values) => {
          return Promise.all([
            counter.get('sample'),
            values[0],
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
            // update.insertMany('CRISPRgene', 'name', 'records', documents.gene),
            // update.insertMany('CRISPRguide', 'sequence', 'records', documents.guide),
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
  sample: (req, user) => {
    return new Promise((resolve) => {
      const sample = req;
      sample.user = user;
      // process immediately, or add to queue
      if (sample.body.type === 'Microscopy') {
        Create.microscopy(sample);
      } else {
        Create.queue.running.push(sample);
        // if queue isn't running, start it
        if (!Create.queue.inProgress) {
          Create.runQueue();
        }
      }
      resolve({
        status: 200,
        clientResponse: {
          status: 200,
          _id: null,
          message: `The sample was queued for processing. You can monitor its
          status by clicking the info button at the bottom right.`,
        },
      });
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
            if (array[0]._id) {
              deleteSample({ _id: array[0]._id });
            }
            next(Create.queue.running);
          })
        ;
      } else {
        Create.queue.inProgress = false;
      }
    };
    next(Create.queue.running);
  },
  screen: (req, user) => {
    return new Promise((resolve) => {
      const addSpecies = (current, dbEntry) => {
        if (
          !current &&
          dbEntry
        ) {
          return dbEntry.name;
        }
        return current;
      };
      let objCreate = {};
      Promise.all([
        validate.create.screen(req.body, 'creationDate', user),
        Permission.canEdit.project(req.body.project, user),
      ])
        .then((values) => {
          objCreate = values[0];
          return Promise.all([
            counter.get('screen'),
            query.get('species', { _id: objCreate.taxonID }, {}, 'findOne'),
          ]);
        })
        .then((values) => {
          // add new id
          objCreate._id = values[0];
          // species name if only taxon ID was supplied
          objCreate.species = addSpecies(objCreate.species, values[1]);
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
  template: (req, user) => {
    return new Promise((resolve) => {
      let objCreate = {};
      Promise.all([
        validate.create.template(req.body, 'creationDate', user),
        Permission.isAdmin(user),
      ])
        .then((values) => {
          objCreate = values[0];
          return counter.get('template');
        })
        .then((sequence) => {
          objCreate._id = sequence;
          return create.insert('template', objCreate);
        })
        .then(() => {
          resolve({
            status: 200,
            clientResponse: {
              status: 200,
              _id: objCreate._id,
              message: `Template successfully created with ID ${objCreate._id}`,
              obj: objCreate,
            },
          });
        })
        .catch((error) => {
          resolve({
            status: 500,
            clientResponse: {
              status: 500,
              message: `There was an error creating this template: ${error}`,
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
