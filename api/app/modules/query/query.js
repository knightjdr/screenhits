'use strict';

const config = require('../../../config');
const database = require('../../connections/database');

const Query = {
	get: (collection, queryObject = {}, returnObject = {}) => {
		return new Promise((resolve, reject) => {
			database.acquire(config.database.name).collection(collection).find(queryObject, returnObject).toArray((err, documents) => {
				if(!err) {
					resolve(documents);
				} else {
					reject('there was an error retrieving data for ' + collection + 's');
				}
			});
		});
	},
};
module.exports = Query;
