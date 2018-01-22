const auth = require('./modules/auth/auth');
const analysis = require('./modules/analysis/analysis');
const analysisAvailable = require('./modules/analysis/analysis-available');
const available = require('./modules/available/available');
const availableList = require('./modules/available/available-list');
const comparison = require('./modules/comparison/comparison');
const create = require('./modules/create/create');
const dataSource = require('./modules/data-source/data-source');
const deleteQuery = require('./modules/delete/delete');
const image = require('./modules/images/route-handler');
const loadRoute = require('./modules/available/load-route');
const queue = require('./modules/queue/queue');
const sample = require('./modules/sample/sample');
const search = require('./modules/search/search');
const tasks = require('./modules/tasks/tasks');
const update = require('./modules/update/update');
const users = require('./modules/users/users');
const view = require('./modules/view/view');
const userPermission = require('./modules/user-permission/permission');

const routes = {
  configure: (app) => {
    // deleting
    app.delete('/management', auth.validate, (req, res) => {
      deleteQuery.item(req.query.target, Number(req.query._id), res.locals.user)
        .then((response) => {
          routes.response(res, response);
        })
      ;
    });
    // delete analysis tasks
    app.delete('/analysis/tasks/:id', auth.validate, (req, res) => {
      tasks.delete(Number(req.params.id), res.locals.user)
        .then((response) => {
          routes.response(res, response);
        })
      ;
    });
    // invalid delete method
    app.delete('/*', (req, res) => {
      res.status(404).send({
        status: 404,
        error: routes.messages.invalidRoute,
      });
    });
    // returns all available project, screens, experiments and samples for a user
    app.get('/analysis/samples', auth.validate, (req, res) => {
      analysisAvailable.get(req.query.screenType, res.locals.user)
        .then((response) => {
          routes.response(res, response);
        })
      ;
    });
    // get analysis tasks
    app.get('/analysis/tasks', auth.validate, (req, res) => {
      tasks.get(res.locals.user)
        .then((response) => {
          routes.response(res, response);
        })
      ;
    });
    app.get('/analysis/tasks/:id', auth.validate, (req, res) => {
      tasks.getOne(Number(req.params.id), req.query, res.locals.user)
        .then((response) => {
          routes.response(res, response);
        })
      ;
    });
    app.get('/image/:fileID', auth.validate, (req, res) => {
      image.get(req.params.fileID, res.locals.user)
        .then((response) => {
          routes.response(res, response);
        })
      ;
    });
    // returns available projects, screens, etc, based on user
    app.get('/loadRoute', auth.validate, (req, res) => {
      loadRoute.get(req.query.target, req.query.selected, res.locals.user)
        .then((response) => {
          routes.response(res, response);
        })
      ;
    });
    // for adding and removing users from project list
    app.get('/login', (req, res) => {
      auth.login(req.get('Signin-Token'), res)
        .then((response) => {
          routes.response(res, response);
        })
      ;
    });
    // returns available projects, screens, etc, based on user
    app.get('/management/list', auth.validate, (req, res) => {
      availableList.get(req.query.target, res.locals.user)
        .then((response) => {
          routes.response(res, response);
        })
      ;
    });
    // returns available projects, screens, etc, based on user
    app.get('/management', auth.validate, (req, res) => {
      available.get(req.query.target, req.query.filters, res.locals.user)
        .then((response) => {
          routes.response(res, response);
        })
      ;
    });
    // gets a list of available users for a project (for user management)
    app.get('/project/users', auth.validate, (req, res) => {
      users.get(Number(req.query._id), req.query.lab, req.query.permission, res.locals.user)
        .then((response) => {
          routes.response(res, response);
        })
      ;
    });
    // returns available projects, screens, etc, based on user
    app.get('/queue', auth.validate, (req, res) => {
      queue.get(req.query.target)
        .then((response) => {
          routes.response(res, response);
        })
      ;
    });
    // returns sample details according to format
    app.get('/sample', auth.validate, (req, res) => {
      sample.get(Number(req.query.target), req.query.format, res.locals.user)
        .then((response) => {
          routes.response(res, response);
        })
      ;
    });
    // get list of available species
    app.get('/species', auth.validate, (req, res) => {
      dataSource.species(req.query.text)
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
    // validating tokens on login
    app.get('/validate', auth.validate, (req, res) => {
      auth.tokenLogin(res)
        .then((response) => {
          routes.response(res, response);
        })
      ;
    });
    app.get('/view/task/:id', auth.validate, (req, res) => {
      view.get(Number(req.params.id), res.locals.user)
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
    // submit comparison
    app.post('/analysis/comparison', auth.validate, (req, res) => {
      comparison.get(req.body, res.locals.user)
        .then((response) => {
          routes.response(res, response);
        })
      ;
    });
    // submit analysis
    app.post('/analysis/new', auth.validate, (req, res) => {
      analysis.create(req.body, res.locals.user)
        .then((response) => {
          routes.response(res, response);
        })
      ;
    });
    // create new projects, screens or experiments
    app.post('/management', auth.validate, (req, res) => {
      create[req.body.target](req, res.locals.user)
        .then((response) => {
          routes.response(res, response);
        })
      ;
    });
    // for adding and removing users from project list
    app.post('/project/users', auth.validate, (req, res) => {
      users.post[req.body.type](req.body._id, req.body.list, res.locals.user)
        .then((response) => {
          routes.response(res, response);
        })
      ;
    });
    // invalid post routes
    app.post('/*', (req, res) => { routes.invalidRoute(res); });
    // updating projects, screens, etc
    app.put('/management', auth.validate, (req, res) => {
      update.put(req.body, res.locals.user)
        .then((response) => {
          routes.response(res, response);
        })
      ;
    });
    // update user permissions
    app.put('/permission', auth.validate, (req, res) => {
      userPermission.put(Number(req.body._id), req.body.permission, res.locals.user)
        .then((response) => {
          routes.response(res, response);
        })
      ;
    });
    // for updating user info for a project
    app.put('/users', auth.validate, (req, res) => {
      users.put(req.body._id, req.body.users, res.locals.user)
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
    const data = response.clientResponse;
    Object.entries(resObject.locals).forEach(([key, value]) => {
      if (key !== 'user') {
        data[key] = value;
      }
    });
    resObject.status(response.status).send(data);
  },
};
module.exports = routes;
