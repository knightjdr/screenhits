const create = require('../crud/create');
const counter = require('../helpers/counter');
const validate = require('../validation/validation');

const Create = {
  experiment: (obj) => {
    return new Promise((resolve) => {
      let objCreate = {};
      validate.experiment(obj, 'creationDate')
        .then((newObj) => {
          objCreate = newObj;
          return counter.get('experiment');
        })
        .then((sequence) => {
          objCreate._id = sequence;
          return create.insert('experiment', objCreate);
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
              message: `There was an error creating this experiment: ${error}`,
            },
          });
        })
      ;
    });
  },
  project: (obj) => {
    return new Promise((resolve) => {
      let objCreate = {};
      validate.project(obj, 'creationDate')
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
  protocol: (obj) => {
    return new Promise((resolve) => {
      let objCreate = {};
      validate.protocol(obj, 'creationDate')
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
  screen: (obj) => {
    return new Promise((resolve) => {
      let objCreate = {};
      validate.screen(obj, 'creationDate')
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
