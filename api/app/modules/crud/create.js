'use strict';

const config = require('../../../config');
const database = require('../../connections/database');

const Create = {
	insert: (collection, createObject) => {
		return new Promise((resolve, reject) => {
			database.acquire(config.database.name).collection(collection).insert(createObject, (err) => {
				if(!err) {
					resolve();
				} else {
					reject('there was an error adding the ' + collection + ' to the database');
				}
			});
		});
	},
};
module.exports = Create;
