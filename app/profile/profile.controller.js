(function() {
	'use strict';

	angular.module('app')
		.controller('profile', ['$scope', function ($scope) {
      var vm = this;
			vm.user = 'Someone';
    }])
  ;
})();
