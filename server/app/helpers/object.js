var Object = {

  notEmpty: function(obj) {
    for(var key in obj) {
      if(obj.hasOwnProperty(key)) {
        return true;
      }
    }
    return false;
	},
  regexKeys: function(obj) {
    for(var key in obj) {
      obj[key] = {'$regex': obj[key]};
    }
    return obj;
	}
}
module.exports = Object;
