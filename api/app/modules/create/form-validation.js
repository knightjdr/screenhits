'use strict';

const moment = require('moment');
const validators = require('../helpers/validators');

const permission = ['lr', 'lw', 'ar', 'aw'];

const Validate = {
  project: (obj) => {
    return new Promise((resolve, reject) => {
      if(!obj['creator-email'] || !validators.email(obj['creator-email']) || !obj['owner-email'] || !validators.email(obj['owner-email'])) {
        reject('invalid email');
      }
      if(!obj['creator-name'] || !obj['owner-name']) {
        reject('missing user name');
      }
      if(!obj.description) {
        reject('missing description');
      }
      if(!obj.lab) {
        reject('missing lab name');
      }
      if(!obj.name) {
        reject('missing project name');
      }
      if(!obj.permission || permission.indexOf(obj.permission) < 0) {
        reject('missing or invalid permission');
      }
      delete obj.target;
      obj['creation-date'] = moment().format('MMMM Do YYYY, h:mm a');
      resolve(obj);
    });
  }
};
module.exports = Validate;
