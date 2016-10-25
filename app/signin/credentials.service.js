(function() {
	'use strict';

	angular.module('app')
    .service('credentials', ['$rootScope', function($rootScope) {
      var user = {};
			this.get = function() {
				return user;
			};
			this.set = function(data) {
				user = data;
				$rootScope.$broadcast('credentials:updated', user);
			};
		}])
  ;
})();
