var bodyparser = require('body-parser');
var config = require('./config');
var cors = require('cors');
var express = require('express');
var http = require('http');
var routes = require('./app/routes');
var app = express();
var server = http.createServer(app);

//initialize connections
var connection = {};
connection[config.database.name] = require(config.connectionsDir + config.database.name);
connection[config.database.name].init();

app.use(cors());
app.use(bodyparser.json({limit: '100mb'}));
app.use(bodyparser.urlencoded({limit: '100mb', extended: true}));

//connection.init();
routes.configure(app);

server.listen(config.port, function() {
	console.log('Server listening on port ' + server.address().port);
});
