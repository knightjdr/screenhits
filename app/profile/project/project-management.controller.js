(function() {
	'use strict';

	angular.module('app')
		.controller('projectManagement', ['$scope', function ($scope) {
      var vm = this;
			vm.form = {
				addUser: {
					email: '',
					name: ''
				}
			};
    }])
  ;
})();
