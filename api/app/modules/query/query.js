'use strict';

const config = require('../../../config');
const database = require('../../connections/database');

const Query = {
	get: (collection, queryObject = {}, returnObject = {}, method = 'find') => {
		return new Promise((resolve, reject) => {
			if(method === 'find') {
				database.acquire(config.database.name).collection(collection).find(queryObject, returnObject).toArray((err, documents) => {
					if(!err) {
						resolve(documents);
					} else {
						reject(`there was an error retrieving data for ${collection} collection`);
					}
				});
			} else {
				database.acquire(config.database.name).collection(collection).findOne(queryObject, returnObject, (err, document) => {
					if(!err) {
						resolve(document);
					} else {
						reject(`there was an error retrieving data for ${collection} collection`);
					}
				});
			}
		});
	},
};
module.exports = Query;
