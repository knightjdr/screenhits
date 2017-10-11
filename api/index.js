const bodyparser = require('body-parser');
const busboyBodyParser = require('busboy-body-parser');
const config = require('./config');
const cors = require('cors');
const database = require('./app/connections/database');
const express = require('express');
const http = require('http');
const routes = require('./app/routes');

// init database connection
database.init();

//  init app
const app = express();
const server = http.createServer(app);
app.use(cors());
app.use(bodyparser.json({ limit: '100mb' }));
app.use(busboyBodyParser({ limit: '100mb' }));
routes.configure(app);

// start server
server.listen(config.settings().port, () => {
  console.log(`Server listening on port ${server.address().port}`);
});
