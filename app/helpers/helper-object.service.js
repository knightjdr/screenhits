(function() {
	'use strict';

	angular.module('app')
    .service('helperObject', [function() {
			this.notEmpty = function(object) {
        for(var prop in object) {
          if(object.hasOwnProperty(prop)) {
            return true;
          }
        }
        return false;
			};
		}])
  ;
})();
