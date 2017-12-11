const auth = require('./modules/auth/auth');
const analysis = require('./modules/analysis/analysis');
const analysisAvailable = require('./modules/analysis/analysis-available');
const available = require('./modules/available/available');
const availableList = require('./modules/available/available-list');
const comparison = require('./modules/comparison/comparison');
const create = require('./modules/create/create');
const deleteQuery = require('./modules/delete/delete');
const loadRoute = require('./modules/available/load-route');
const permission = require('./modules/permission/permission');
const queue = require('./modules/queue/queue');
const sample = require('./modules/sample/sample');
const search = require('./modules/search/search');
const tasks = require('./modules/tasks/tasks');
const update = require('./modules/update/update');
const users = require('./modules/users/users');
const view = require('./modules/view/view');

const routes = {
  configure: (app) => {
    // deleting
    app.delete('/management', auth.validate, (req, res) => {
      deleteQuery.item(req.query.target, Number(req.query._id))
        .then((response) => {
          routes.response(res, response);
        })
      ;
    });
    // delete analysis tasks
    app.delete('/analysis/tasks/:id', auth.validate, (req, res) => {
      tasks.delete(Number(req.params.id), req.email)
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
      analysisAvailable.get(req.query.screenType, req.email)
        .then((response) => {
          routes.response(res, response);
        })
      ;
    });
    // get analysis tasks
    app.get('/analysis/tasks', auth.validate, (req, res) => {
      tasks.get()
        .then((response) => {
          routes.response(res, response);
        })
      ;
    });
    app.get('/analysis/tasks/:id', auth.validate, (req, res) => {
      tasks.getOne(req.params.id, req.query)
        .then((response) => {
          routes.response(res, response);
        })
      ;
    });
    // returns available projects, screens, etc, based on user
    app.get('/loadRoute', auth.validate, (req, res) => {
      loadRoute.get(req.query.target, req.email, req.lab, req.query.selected)
        .then((response) => {
          routes.response(res, response);
        })
      ;
    });
    // returns available projects, screens, etc, based on user
    app.get('/management/list', auth.validate, (req, res) => {
      availableList.get(req.query.target, req.email)
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
      sample.get(req.query.target, req.query.format)
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
    app.get('/view/task/:id', auth.validate, (req, res) => {
      view.get(Number(req.params.id))
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
      comparison.get(req.body)
        .then((response) => {
          routes.response(res, response);
        })
      ;
    });
    // submit analysis
    app.post('/analysis/new', auth.validate, (req, res) => {
      analysis.create(req.body)
        .then((response) => {
          routes.response(res, response);
        })
      ;
    });
    // create new projects, screens or experiments
    app.post('/management', auth.validate, (req, res) => {
      create[req.body.target](req)
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
    // for adding and removing users from project list
    app.post('/login', (req, res) => {
      auth.login(req.body.token, res)
        .then((response) => {
          routes.response(res, response);
        })
      ;
    });
    // for adding and removing users from project list
    app.post('/logout', (req, res) => {
      auth.logout(req.body.email, req.body.token)
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
    const data = response.clientResponse;
    Object.entries(resObject.locals).forEach(([key, value]) => {
      data[key] = value;
    });
    resObject.status(response.status).send(data);
  },
};
module.exports = routes;
