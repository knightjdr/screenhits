const auth = require('./modules/auth/validate');
const available = require('./modules/available/available');
const create = require('./modules/create/create');
const permission = require('./modules/permission/permission');
const search = require('./modules/search/search');
const update = require('./modules/update/update');
const users = require('./modules/users/users');

const Routes = {
	configure: (app) => {
		app.get('/management', auth.validate, (req, res) => {
			available.get(req.query.target, req.email, req.lab, res);
		});
		app.get('/project/users', auth.validate, (req, res) => {
			users.get(req.query._id, req.query.lab, req.query.permission, res);
		});
		app.get('/users', auth.validate, (req, res) => {
			search.user(req.query.type, req.query[req.query.type], res);
		});
		app.get('/*', (req, res) => {
			res.status(404).send({status: 404, error: 'ScreenHits - the route is not valid'});
		});
		app.post('/management', (req, res) => {
			create[req.body.target](req.body, res);
		});
		app.post('/project/users', auth.validate, (req, res) => {
			users.post[req.body.type](req.body._id, req.body.list, res);
		});
		app.post('/*', (req, res) => {
			res.status(404).send({status: 404, error: 'ScreenHits - the route is not valid'});
		});
		app.put('/management', (req, res) => {
			update.put(req.body, res);
		});
		app.put('/permission', auth.validate, (req, res) => {
			permission.put(req.body._id, req.body.permission, res);
		});
		app.put('/users', auth.validate, (req, res) => {
			users.put(req.body._id, req.body.users, res);
		});
		app.put('/*', (req, res) => {
			res.status(404).send({status: 404, error: 'ScreenHits - the route is not valid'});
		});
		app.use((req, res) => {
			res.status(405).send({status: 405, error: 'ScreenHits - request method not supported'});
		});
  },
};
module.exports = Routes;
