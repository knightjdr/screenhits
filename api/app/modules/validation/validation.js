const sort = require('../helpers/sort');
const moment = require('moment');
const validators = require('../helpers/validators');

const permission = ['lr', 'lw', 'ar', 'aw'];

const validate = {
  experiment: (obj, dateType, creation = true) => {
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
      if (!validateObj.description) {
        reject('missing experiment description');
      }
      if (!validateObj.name) {
        reject('missing experiment name');
      }
      if (
        creation &&
        !validateObj.project
      ) {
        reject('missing project');
      }
      if (
        creation &&
        !validateObj.screen
      ) {
        reject('missing screen');
      }
      if (creation) {
        validateObj.group = {
          project: Number(validateObj.project),
          screen: Number(validateObj.screen),
        };
      }
      delete validateObj.project;
      delete validateObj.screen;
      if (validateObj.target) {
        delete validateObj.target;
      }
      // when updating, need to remove fullProtocols attribute
      if (validateObj.fullProtocols) {
        delete validateObj.fullProtocols;
      }
      validateObj[dateType] = moment().format('MMMM Do YYYY, h:mm a');
      resolve(validateObj);
    });
  },
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
      // sort subsections by name
      if (validateObj.subSections.length > 0) {
        validateObj.subSections = sort.arrayOfObjectByKey(validateObj.subSections, 'name');
      }
      // add date
      validateObj[dateType] = moment().format('MMMM Do YYYY, h:mm a');
      resolve(validateObj);
    });
  },
  sample: (obj, dateType, creation = true) => {
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
      if (!validateObj.name) {
        reject('missing sample name');
      }
      if (
        creation &&
        !validateObj.project
      ) {
        reject('missing project');
      }
      if (
        creation &&
        !validateObj.screen
      ) {
        reject('missing screen');
      }
      if (
        creation &&
        !validateObj.experiment
      ) {
        reject('missing experiment');
      }
      let fileType;
      let header;
      let parser;
      if (validateObj.fileType) {
        fileType = validateObj.fileType;
        delete validateObj.fileType;
      }
      if (validateObj.header) {
        header = JSON.parse(validateObj.header);
        validateObj.properties = header.map((column) => {
          return {
            layName: column.layName,
            name: column.name,
            type: column.type,
          };
        });
        delete validateObj.header;
      }
      if (validateObj.parser) {
        parser = JSON.parse(validateObj.parser);
        delete validateObj.parser;
      }
      if (creation) {
        validateObj.group = {
          experiment: Number(validateObj.experiment),
          project: Number(validateObj.project),
          screen: Number(validateObj.screen),
        };
      }
      delete validateObj.experiment;
      delete validateObj.project;
      delete validateObj.screen;
      if (validateObj.target) {
        delete validateObj.target;
      }
      validateObj[dateType] = moment().format('MMMM Do YYYY, h:mm a');
      resolve(Object.assign(
        {},
        {
          data: validateObj,
        },
        {
          fileType,
          header,
          parser,
        }
      ));
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
          project: Number(validateObj.project),
        };
      }
      delete validateObj.project;
      if (validateObj.target) {
        delete validateObj.target;
      }
      validateObj[dateType] = moment().format('MMMM Do YYYY, h:mm a');
      resolve(validateObj);
    });
  },
};
module.exports = validate;
