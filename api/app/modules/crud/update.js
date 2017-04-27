'use strict';

const config = require('../../../config');
const database = require('../../connections/database');

const Update = {
	insert: (collection, queryObject, updateObject) => {
		return new Promise((resolve, reject) => {
			database.acquire(config.database.name).collection(collection).update(queryObject, updateObject, (err) => {
				if(!err) {
					resolve();
				} else {
					reject('there was an error updaing the ' + collection);
				}
			});
		});
	},
};
module.exports = Update;
