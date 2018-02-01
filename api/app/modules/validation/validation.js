const sort = require('../helpers/sort');
const moment = require('moment');
const validators = require('../helpers/validators');

const permission = ['lr', 'lw', 'ar', 'aw'];

const validate = {
  create: {
    experiment: (obj, dateType, user) => {
      return new Promise((resolve, reject) => {
        const validateObj = JSON.parse(JSON.stringify(obj));
        if (
          !validateObj.creatorEmail ||
          !validators.email(validateObj.creatorEmail) ||
          validateObj.creatorEmail !== user.email
        ) {
          reject('invalid email');
        }
        if (
          !validateObj.creatorName ||
          validateObj.creatorName !== user.name
        ) {
          reject('missing user name');
        }
        if (
          !validateObj.lab ||
          validateObj.lab !== user.lab
        ) {
          reject('missing lab name');
        }
        if (!validateObj.name) {
          reject('missing experiment name');
        }
        if (!validateObj.project) {
          reject('missing project');
        }
        if (!validateObj.screen) {
          reject('missing screen');
        }
        validateObj.group = {
          project: Number(validateObj.project),
          screen: Number(validateObj.screen),
        };
        delete validateObj.project;
        delete validateObj.screen;
        if (validateObj.target) {
          delete validateObj.target;
        }
        validateObj[dateType] = moment().format('MMMM Do YYYY, h:mm a');
        resolve(validateObj);
      });
    },
    microscopy: (obj, dateType, user) => {
      return new Promise((resolve, reject) => {
        const validateObj = JSON.parse(JSON.stringify(obj));
        if (
          !validateObj.creatorEmail ||
          !validators.email(validateObj.creatorEmail) ||
          validateObj.creatorEmail !== user.email
        ) {
          reject('invalid email');
        }
        if (
          !validateObj.creatorName ||
          validateObj.creatorName !== user.name
        ) {
          reject('missing user name');
        }
        if (
          !validateObj.lab ||
          validateObj.lab !== user.lab
        ) {
          reject('missing lab name');
        }
        if (!validateObj.name) {
          reject('missing sample name');
        }
        if (!validateObj.project) {
          reject('missing project');
        }
        if (!validateObj.screen) {
          reject('missing screen');
        }
        if (!validateObj.experiment) {
          reject('missing experiment');
        }
        validateObj.channels = JSON.parse(validateObj.channels);
        validateObj.group = {
          experiment: Number(validateObj.experiment),
          project: Number(validateObj.project),
          screen: Number(validateObj.screen),
        };
        delete validateObj.experiment;
        delete validateObj.project;
        delete validateObj.screen;
        if (validateObj.target) {
          delete validateObj.target;
        }
        validateObj[dateType] = moment().format('MMMM Do YYYY, h:mm a');
        resolve(validateObj);
      });
    },
    project: (obj, dateType, user) => {
      return new Promise((resolve, reject) => {
        const validateObj = JSON.parse(JSON.stringify(obj));
        if (
          !validateObj.creatorEmail ||
          !validators.email(validateObj.creatorEmail) ||
          validateObj.creatorEmail !== user.email ||
          !validateObj.ownerEmail ||
          !validators.email(validateObj.ownerEmail) ||
          validateObj.ownerEmail !== user.email
        ) {
          reject('invalid email');
        }
        if (
          !validateObj.creatorName ||
          validateObj.creatorName !== user.name ||
          !validateObj.ownerName ||
          validateObj.ownerName !== user.name
        ) {
          reject('missing user name');
        }
        if (!validateObj.description) {
          reject('missing description');
        }
        if (
          !validateObj.lab ||
          validateObj.lab !== user.lab
        ) {
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
    protocol: (obj, dateType, user) => {
      return new Promise((resolve, reject) => {
        const validateObj = JSON.parse(JSON.stringify(obj));
        if (
          !validateObj.creatorEmail ||
          !validators.email(validateObj.creatorEmail) ||
          validateObj.creatorEmail !== user.email
        ) {
          reject('invalid email');
        }
        if (
          !validateObj.creatorName ||
          validateObj.creatorName !== user.name
        ) {
          reject('missing user name');
        }
        if (
          !validateObj.lab ||
          validateObj.lab !== user.lab
        ) {
          reject('missing lab name');
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
    sample: (obj, dateType, user) => {
      return new Promise((resolve, reject) => {
        const validateObj = JSON.parse(JSON.stringify(obj));
        if (
          !validateObj.creatorEmail ||
          !validators.email(validateObj.creatorEmail) ||
          validateObj.creatorEmail !== user.email
        ) {
          reject('invalid email');
        }
        if (
          !validateObj.creatorName ||
          validateObj.creatorName !== user.name
        ) {
          reject('missing user name');
        }
        if (
          !validateObj.lab ||
          validateObj.lab !== user.lab
        ) {
          reject('missing lab name');
        }
        if (!validateObj.name) {
          reject('missing sample name');
        }
        if (!validateObj.project) {
          reject('missing project');
        }
        if (!validateObj.screen) {
          reject('missing screen');
        }
        if (!validateObj.experiment) {
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
        validateObj.group = {
          experiment: Number(validateObj.experiment),
          project: Number(validateObj.project),
          screen: Number(validateObj.screen),
        };
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
    screen: (obj, dateType, user) => {
      return new Promise((resolve, reject) => {
        const validateObj = JSON.parse(JSON.stringify(obj));
        if (
          !validateObj.creatorEmail ||
          !validators.email(validateObj.creatorEmail) ||
          validateObj.creatorEmail !== user.email
        ) {
          reject('invalid email');
        }
        if (
          !validateObj.creatorName ||
          validateObj.creatorName !== user.name
        ) {
          reject('missing user name');
        }
        if (
          !validateObj.lab ||
          validateObj.lab !== user.lab
        ) {
          reject('missing lab name');
        }
        if (!validateObj.cell) {
          reject('missing cell type');
        }
        if (!validateObj.name) {
          reject('missing screen name');
        }
        if (!validateObj.project) {
          reject('missing project');
        }
        if (
          !validateObj.taxonID ||
          isNaN(validateObj.taxonID)
        ) {
          reject('missing taxon ID');
        }
        if (!validateObj.type) {
          reject('missing screen type');
        }
        validateObj.group = {
          project: Number(validateObj.project),
        };
        delete validateObj.project;
        if (validateObj.target) {
          delete validateObj.target;
        }
        // parse drug and cell line mod strings
        if (validateObj.cellMods) {
          validateObj.cellMods = validateObj.cellMods.split(/\s*,\s*/);
        }
        if (validateObj.drugs) {
          validateObj.drugs = validateObj.drugs.split(/\s*,\s*/).map((drug) => {
            return !isNaN(drug) ? Number(drug) : drug;
          });
        }
        // and creation date
        validateObj[dateType] = moment().format('MMMM Do YYYY, h:mm a');
        resolve(validateObj);
      });
    },
    template: (obj, dateType, user) => {
      return new Promise((resolve, reject) => {
        const validateObj = JSON.parse(JSON.stringify(obj));
        if (
          !validateObj.creatorEmail ||
          !validators.email(validateObj.creatorEmail) ||
          validateObj.creatorEmail !== user.email
        ) {
          reject('invalid email');
        }
        if (
          !validateObj.creatorName ||
          validateObj.creatorName !== user.name
        ) {
          reject('missing user name');
        }
        if (
          !validateObj.lab ||
          validateObj.lab !== user.lab
        ) {
          reject('missing lab name');
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
  },
  update: {
    experiment: (obj, dateType) => {
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
          reject('missing experiment name');
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
        if (!validateObj.lab) {
          reject('missing lab name');
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
    sample: (obj, dateType) => {
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
        if (!validateObj.replicate) {
          reject('missing sample name');
        }
        validateObj[dateType] = moment().format('MMMM Do YYYY, h:mm a');
        if (validateObj.type !== 'Microscopy') {
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
          delete validateObj.experiment;
          delete validateObj.project;
          delete validateObj.screen;
          if (validateObj.target) {
            delete validateObj.target;
          }
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
        } else {
          validateObj.channels = validateObj.channels;
          resolve(validateObj);
        }
      });
    },
    screen: (obj, dateType) => {
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
        if (!validateObj.name) {
          reject('missing screen name');
        }
        if (!validateObj.species) {
          reject('missing species');
        }
        if (
          !validateObj.taxonID ||
          isNaN(validateObj.taxonID)
        ) {
          reject('missing taxon ID');
        }
        if (!validateObj.type) {
          reject('missing screen type');
        }
        delete validateObj.project;
        if (validateObj.target) {
          delete validateObj.target;
        }
        // parse drug and cell line mod strings
        if (
          validateObj.cellMods &&
          !Array.isArray(validateObj.cellMods)
        ) {
          validateObj.cellMods = validateObj.cellMods.split(/\s*,\s*/);
        }
        if (
          validateObj.drugs &&
          !Array.isArray(validateObj.drugs)
        ) {
          validateObj.drugs = validateObj.drugs.split(/\s*,\s*/).map((drug) => {
            return !isNaN(drug) ? Number(drug) : drug;
          });
        }
        delete validateObj.drugNames;
        validateObj[dateType] = moment().format('MMMM Do YYYY, h:mm a');
        resolve(validateObj);
      });
    },
    template: (obj, dateType) => {
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
        if (!validateObj.lab) {
          reject('missing lab name');
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
  },
};
module.exports = validate;
