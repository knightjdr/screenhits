var config = require('../../config');
var database = require(config.connectionsDir + config.database.name);
var document = require('../helpers/document');

var Project = {

  add: function(data) {
    var id = document.counter('projects', 'projectid');
    database.acquire().collection(collection).insert(data.);
	}
}
module.exports = Project;
