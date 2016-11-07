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
			vm.reset = function () {
				$scope.addUserForm.email = '';
				$scope.addUserForm.name = '';
				$scope.addUserForm.$setPristine();
				$scope.addUserForm.$setUntouched();
				vm.form.addUser.email = '';
				vm.form.addUser.name = '';
			};
			vm.submit = function(form) {
				if((form.email && form.email.match(/^.+@.+\..+$/)) || form.name) {
					var formToSubmit = {};
					if(form.name) {
						formToSubmit.name = form.name;
					}
					if((form.email && form.email.match(/^.+@.+\..+$/))) {
						formToSubmit.name = form.email;
					}
				}
			};
    }])
  ;
})();
