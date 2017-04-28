'use strict';

const create = require('../crud/create');
const counter = require('../helpers/counter');
const validate = require('../validation/validation');

const Create = {
  project: (obj, res) => {
    let objCreate = {};
    validate.project(obj, 'creation-date')
      .then((newObj) => {
        objCreate = newObj;
        return counter.get('project');
      })
      .then((sequence) => {
        objCreate._id = sequence;
        return create.insert('project', objCreate);
      })
      .then(() => {
        res.send({status: 200, _id: objCreate._id, message: 'Project successfully created with ID ' + objCreate._id});
      })
      .catch((error) => {
        res.status(500).send({status: 500, message: 'There was an error creating this project: ' + error});
      })
    ;
  }
};
module.exports = Create;
