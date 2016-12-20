(function() {
	'use strict';

	angular.module('app')
		.controller('screenManagement', ['helperDialog', 'helperHTTP', 'helperObject', '$http', '$rootScope', '$scope', 'screens', '$timeout', function (helperDialog, helperHTTP, helperObject, $http, $rootScope, $scope, screens, $timeout) {
      var vm = this;
			vm.form = {};
			vm.reset = function() {
        $scope.form.approach = '';
        $scope.form.cell = '';
        $scope.form.comment = '';
        $scope.form.condition = '';
        $scope.form.description = '';
        $scope.form.library = '';
				$scope.form.name = '';
        $scope.form.species = '';
        $scope.form.type = '';
				$scope.form.$setPristine();
				$scope.form.$setUntouched();
				vm.form = {};
			};
			vm.submit = function(valid, form, project, user) {
        if(valid && helperObject.notEmpty(form)) {
					vm.message = '';
					var formObject = form;
					formObject.creator = user;
          formObject.project = project;
          var success = function(response) {
            vm.reset();
            vm.message = response.data.message;
						screens.add(response.data.screen);
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
          helperHTTP.set('project/screen', formObject, success, failure);
        }
			};
      //get libaries
      $http.get('app/profile/screen/resources/options.json')
				.then(function successCallback(response) {
          vm.approaches = response.data.approaches;
          vm.cells = response.data.cells;
					vm.libraries = response.data.libraries;
          vm.species = response.data.species;
          vm.types = response.data.types;
          $timeout(function() {
          	$scope.$digest();
					});
				}, function errorCallback(response) {
					helperDialog.alert('Resource error', 'Library information could not be retrieved.');
				})
			;
    }])
  ;
})();
