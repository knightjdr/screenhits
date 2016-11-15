var Object = {

  notEmpty: function(obj) {
    for(var key in obj) {
      if(obj.hasOwnProperty(key)) {
        return true;
      }
    }
    return false;
	},
  //converts object values to lowercase and wraps in wildcards for generic search
  regexKeys: function(obj) {
    for(var key in obj) {
      obj[key] = {'$regex': new RegExp(obj[key], 'i')};
    }
    return obj;
	}
}
module.exports = Object;
