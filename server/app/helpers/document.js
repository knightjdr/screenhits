var config = require('../../config');
var database = require(config.connectionsDir + config.database.name);

var Document = {

  counter: function(collection, name) {
    var entry = database.acquire().collection(collection).findAndModify(
      {
        { _id: name },
        { $inc: { sequence: 1 } },
        new: true
      }, function(err, result) {
        console.log(err, result);
      }
   );
   return entry.sequence;
	}
}
module.exports = Document;
