const available = require('../available/available');
const create = require('../crud/create');
const counter = require('../helpers/counter');
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
  sample: (req) => {
    return new Promise((resolve) => {
      const objCreate = {};
      validate.sample(req.body, 'creationDate')
        .then((validatedObj) => {
          return Promise.all([
            counter.get('sample'),
            validatedObj,
          ]);
        })
        .then((data) => {
          objCreate._id = data[0];
          return readFile[data[1].data.type](
            req.files,
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
};
module.exports = Create;
