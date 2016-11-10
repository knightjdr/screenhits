var config = require('../../config');
var database = require(config.connectionsDir + config.database.name);

var Document = {

  counter: function(name, callback) {
    database.acquire().collection('counters').findAndModify(
      {_id: name},
      [],
      {$inc: { sequence: 1}},
      {new: true},
      function(err, doc) {
        if(err) {
          callback(true, 0);
        } else {
          callback(false, doc.value.sequence);
        }
      }
   );
	}
}
module.exports = Document;
