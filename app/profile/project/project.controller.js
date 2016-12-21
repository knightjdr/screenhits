(function() {
	'use strict';

	angular.module('app')
		.controller('project', ['$rootScope', function ($rootScope) {
      var vm = this;
      vm.show = '';
			vm.showChild = function(id) {
				vm.show = id;
				$rootScope.$broadcast('height:updated');
			};
    }])
  ;
})();
