(function() {
	'use strict';

	angular.module('app')
		.controller('projectNew', ['credentials', 'helperHTTP', 'projects', '$scope', '$timeout', function (credentials, helperHTTP, projects, $scope, $timeout) {
      var vm = this;
      vm.form = {};
			vm.partialReset = function () {
				$scope.form.name = '';
				$scope.form.description = '';
				$scope.form.$setPristine();
				$scope.form.$setUntouched();
        vm.form = {};
			};
			vm.reset = function () {
				$scope.form.name = '';
				$scope.form.description = '';
				$scope.form.$setPristine();
				$scope.form.$setUntouched();
        vm.form = {};
        vm.message = '';
			};
			vm.submit = function(valid, form) {
        vm.message = '';
        if(valid) {
          var user = credentials.get();
          var formObject = {};
          formObject.created = Date.now();
          formObject.creator = user.name;
          formObject.description = form.description;
          formObject.title = form.name;
          var success = function(response) {
            vm.reset();
						vm.message = response.data.message;
						projects.add(response.data.project);
						$timeout(function() {
							vm.message = '';
						}, 10000);
          };
          var failure = function(response) {
            vm.message = response.data.message;
						$timeout(function() {
							vm.message = '';
						}, 10000);
          };
          helperHTTP.set('project', formObject, success, failure);
        }
			};
    }])
  ;
})();
