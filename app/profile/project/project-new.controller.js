(function() {
	'use strict';

	angular.module('app')
		.controller('projectNew', ['credentials', 'helperHTTP', '$scope', function (credentials, helperHTTP, $scope) {
      var vm = this;
      vm.form = {};
			vm.reset = function () {
				$scope.form.name = '';
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
            vm.message = response.data.message;
            vm.reset();
          };
          var failure = function(response) {
            vm.message = response.data.message;
          };
          helperHTTP.set('project', formObject, success, failure);
        }
			};
    }])
  ;
})();
