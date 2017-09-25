const moment = require('moment');
const validators = require('../helpers/validators');

const permission = ['lr', 'lw', 'ar', 'aw'];

const validate = {
  project: (obj, dateType) => {
    return new Promise((resolve, reject) => {
      const validateObj = obj;
      if (
        !validateObj.creatorEmail ||
        !validators.email(validateObj.creatorEmail) ||
        !validateObj.ownerEmail ||
        !validators.email(validateObj.ownerEmail)
      ) {
        reject('invalid email');
      }
      if (
        !validateObj.creatorName ||
        !validateObj.ownerName
      ) {
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
  protocol: (obj, dateType) => {
    return new Promise((resolve, reject) => {
      const validateObj = obj;
      if (
        !validateObj.creatorEmail ||
        !validators.email(validateObj.creatorEmail)
      ) {
        reject('invalid email');
      }
      if (!validateObj.creatorName) {
        reject('missing user name');
      }
      if (validateObj.target) {
        delete validateObj.target;
      }
      validateObj[dateType] = moment().format('MMMM Do YYYY, h:mm a');
      resolve(validateObj);
    });
  },
  screen: (obj, dateType, creation = true) => {
    return new Promise((resolve, reject) => {
      const validateObj = obj;
      if (
        !validateObj.creatorEmail ||
        !validators.email(validateObj.creatorEmail)
      ) {
        reject('invalid email');
      }
      if (!validateObj.creatorName) {
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
