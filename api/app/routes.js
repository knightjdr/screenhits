const auth = require('./modules/auth/validate');
const available = require('./modules/available/available');
const create = require('./modules/create/create');
const loadRoute = require('./modules/available/load-route');
const permission = require('./modules/permission/permission');
const search = require('./modules/search/search');
const update = require('./modules/update/update');
const users = require('./modules/users/users');

const routes = {
  configure: (app) => {
    // returns available projects, screens, etc, based on user
    app.get('/loadRoute', auth.validate, (req, res) => {
      loadRoute.get(req.query.target, req.email, req.lab, req.query.selected)
        .then((response) => {
          routes.response(res, response);
        })
      ;
    });
    // returns available projects, screens, etc, based on user
    app.get('/management', auth.validate, (req, res) => {
      available.get(req.query.target, req.email, req.lab, req.query.filters)
        .then((response) => {
          routes.response(res, response);
        })
      ;
    });
    // gets a list of available users for a project (for user management)
    app.get('/project/users', auth.validate, (req, res) => {
      users.get(req.query._id, req.query.lab, req.query.permission)
        .then((response) => {
          routes.response(res, response);
        })
      ;
    });
    // for user searches
    app.get('/users', auth.validate, (req, res) => {
      search.user(req.query.type, req.query[req.query.type])
        .then((response) => {
          routes.response(res, response);
        })
      ;
    });
    // invalid get methods
    app.get('/*', (req, res) => {
      res.status(404).send({
        status: 404,
        error: routes.messages.invalidRoute,
      });
    });
    // create new projects, screens, etc
    app.post('/management', auth.validate, (req, res) => {
      create[req.body.target](req.body)
        .then((response) => {
          routes.response(res, response);
        })
      ;
    });
    // for adding and removing users from project list
    app.post('/project/users', auth.validate, (req, res) => {
      users.post[req.body.type](req.body._id, req.body.list)
        .then((response) => {
          routes.response(res, response);
        })
      ;
    });
    // invalid post routes
    app.post('/*', (req, res) => { routes.invalidRoute(res); });
    // updating projects, screens, etc
    app.put('/management', auth.validate, (req, res) => {
      update.put(req.body)
        .then((response) => {
          routes.response(res, response);
        })
      ;
    });
    // update user permissions
    app.put('/permission', auth.validate, (req, res) => {
      permission.put(req.body._id, req.body.permission)
        .then((response) => {
          routes.response(res, response);
        })
      ;
    });
    // for updating user info for a project
    app.put('/users', auth.validate, (req, res) => {
      users.put(req.body._id, req.body.users)
        .then((response) => {
          routes.response(res, response);
        })
      ;
    });
    // invalid put routes
    app.put('/*', (req, res) => { routes.invalidRoute(res); });
    // for invalid methods
    app.use((req, res) => {
      res.status(405).send({
        status: 405,
        error: routes.messages.notSupported,
      });
    });
  },
  invalidRote: (res) => {
    res.status(404).send({
      status: 404,
      error: routes.messages.invalidRoute,
    });
  },
  messages: {
    authFailure: 'You either do not have permission to perform this action or your permissions could not be validated',
    genericError: 'There was an error processing your request',
    invalidRoute: 'ScreenHits - the route is not valid',
    notSupported: 'The requested method is not supported',
  },
  response: (resObject, response) => {
    resObject.status(response.status).send(response.clientResponse);
  },
};
module.exports = routes;
