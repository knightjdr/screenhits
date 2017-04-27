'use strict';

const auth = require('./modules/auth/validate');
const available = require('./modules/available/available');
const create = require('./modules/create/create');
const update = require('./modules/update/update');

const Routes = {
	configure: (app) => {
		app.get('/management', auth.validate, (req, res) => {
			available.get(req.query.target, req.email, req.lab, res);
		});
		app.get('/*', (req, res) => {
			res.status(404).send({status: 404, error: 'ScreenHits - the route is not valid'});
		});
		app.post('/creation', (req, res) => {
			create[req.body.target](req.body, res);
		});
		app.post('/*', (req, res) => {
			res.status(404).send({status: 404, error: 'ScreenHits - the route is not valid'});
		});
		app.put('/management', (req, res) => {
			update.put(req.body, res);
		});
		app.put('/*', (req, res) => {
			res.status(404).send({status: 404, error: 'ScreenHits - the route is not valid'});
		});
		app.use((req, res) => {
			res.status(405).send({status: 405, error: 'ScreenHits - request method not supported'});
		});
  }
};
module.exports = Routes;
