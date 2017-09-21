const moment = require('moment');
const validators = require('../helpers/validators');

const permission = ['lr', 'lw', 'ar', 'aw'];

const validate = {
  project: (obj, dateType) => {
    return new Promise((resolve, reject) => {
      const validateObj = obj;
      if (
        !validateObj['creator-email'] ||
        !validators.email(validateObj['creator-email']) ||
        !validateObj['owner-email'] ||
        !validators.email(validateObj['owner-email'])
      ) {
        reject('invalid email');
      }
      if (!validateObj['creator-name'] || !validateObj['owner-name']) {
        reject('missing user name');
      }
      if (!validateObj.description) {
        reject('missing description');
      }
      if (!validateObj.lab) {
        reject('missing lab name');
      }
      if (!validateObj.name) {
        reject('missing project name');
      }
      if (!validateObj.permission || permission.indexOf(validateObj.permission) < 0) {
        reject('missing or invalid permission');
      }
      delete validateObj.target;
      validateObj[dateType] = moment().format('MMMM Do YYYY, h:mm a');
      resolve(validateObj);
    });
  },
  screen: (obj, dateType, creation = true) => {
    return new Promise((resolve, reject) => {
      const validateObj = obj;
      if (
        !validateObj['creator-email'] ||
        !validators.email(validateObj['creator-email'])
      ) {
        reject('invalid email');
      }
      if (!validateObj['creator-name']) {
        reject('missing user name');
      }
      if (!validateObj.cell) {
        reject('missing cell type');
      }
      if (!validateObj.description) {
        reject('missing screen description');
      }
      if (!validateObj.name) {
        reject('missing screen name');
      }
      if (
        creation &&
        !validateObj.project
      ) {
        reject('missing project');
      }
      if (!validateObj.species) {
        reject('missing species');
      }
      if (!validateObj.type) {
        reject('missing screen type');
      }
      if (creation) {
        validateObj.group = {
          project: validateObj.project,
        };
      }
      if (validateObj.project) {
        delete validateObj.project;
      }
      if (validateObj.target) {
        delete validateObj.target;
      }
      validateObj[dateType] = moment().format('MMMM Do YYYY, h:mm a');
      resolve(validateObj);
    });
  },
};
module.exports = validate;
