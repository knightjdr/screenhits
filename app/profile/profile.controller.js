(function() {
	'use strict';

	angular.module('app')
		.controller('profile', ['credentials', 'helperHTTP', 'projects', '$scope', 'screens', '$state', '$timeout', function (credentials, helperHTTP, projects, $scope, screens, $state, $timeout) {
      var vm = this;
			vm.newProject = function() {
				$state.go('root.projects.new');
				angular.element(document.getElementById('projects-button')).triggerHandler('click');
			};
			vm.projects = [];
			vm.screens = [];
			vm.selectProject = function(project) {
				if(!vm.project || vm.project !== project) {
					vm.experiment = '';
					vm.project = project;
					vm.sample = '';
					vm.screen = '';
					projects.setCurrent(project);
					//get screen details
					var screenSuccess = function(response) {
						screens.set(response.data.screens);
						vm.screens = response.data.screens;
						$timeout(function() {
							$scope.$digest();
						});
					};
					var screenFailure = function(response) {
						helperDialog.alert('Error', response.data.message);
					};
					helperHTTP.get('project/screen', {project: project._id}, screenSuccess, screenFailure);
				}
				//change state
				$state.go('root.projects.details', {project: project._id});
				angular.element(document.getElementById('projects-button')).triggerHandler('click');
			};
			$scope.$on('credentials:updated', function(event, data) {
				if(data.name) {
					vm.user = data.name;
					$timeout(function() {
						$scope.$digest();
					});
				}
			});
			//after project added
			$scope.$on('projects:updated', function(event, data) {
				vm.projects = data;
				$timeout(function() {
					$scope.$digest();
				});
			});
			//get screen details
			$scope.$on('screens:updated', function(event, data) {
				vm.screens = data;
				$timeout(function() {
					$scope.$digest();
				});
			});
    }])
  ;
})();
