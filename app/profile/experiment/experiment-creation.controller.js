(function() {
	'use strict';

	angular.module('app')
		.controller('experimentManagement', ['credentials', 'helperDialog', 'helperHTTP', 'helperObject', '$http', 'projects', '$scope', '$timeout', function (credentials, helperDialog, helperHTTP, helperObject, $http, projects, $scope, $timeout) {
      var vm = this;
			vm.form = {};
			vm.formProtocol = {details: []};
      vm.protocolDetails = false;
      vm.protocolCreation = false;
			vm.reset = function() {
        $scope.form.comment = '';
        $scope.form.description = '';
        $scope.form.protocol = '';
				$scope.form.$setPristine();
				$scope.form.$setUntouched();
				vm.form = {};
			};
			vm.submit = function(valid, form, project, screen) {
        if(valid && helperObject.notEmpty(form)) {
					vm.message = '';
					var formObject = form;
          formObject.project = project;
          formObject.screen = screen;
          var success = function(response) {
            vm.reset();
            vm.message = response.data.message;
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
          helperHTTP.get('project/screen', formObject, success, failure);
        }
			};
			//get users protocols
			$scope.$on('project:set', function() {
				var protocolSuccess = function(response) {
					vm.protocols = response.data.protocols;
				};
				var protocolFailure = function(response) {
					helperDialog.alert('Error', response.data.message);
				};
				helperHTTP.get('project/protocols', {user: credentials.get().name, project: projects.getCurrent()._id}, protocolSuccess, protocolFailure);
			});
    }])
  ;
})();
