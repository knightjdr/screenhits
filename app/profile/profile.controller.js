(function() {
	'use strict';

	angular.module('app')
		.controller('profile', ['$scope', '$timeout', function ($scope, $timeout) {
      var vm = this;
			vm.checkLocation = function(location, response) {
				if(!location || /^main-*/.test(location)) {
					return response;
				}
				return !response;
			};
			vm.introduction = true;
			vm.newProject = function() {
				vm.introduction = false;
				vm.location = 'main-project-new';
				angular.element(document.getElementById('projects-button')).triggerHandler('click');
			};
			vm.projects = [];
			vm.selectProject = function(project) {
				if(!vm.project || vm.project !== project) {
					vm.experiment = '';
					vm.project = project;
					vm.sample = '';
					vm.screen = '';
				}
				vm.introduction = false;
				vm.location = 'main-project';
				angular.element(document.getElementById('projects-button')).triggerHandler('click');
			};
			vm.user = 'Someone';
			$scope.$on('projects:updated', function(event, data) {
				vm.projects = data;
				$timeout(function() {
					$scope.$digest();
				});
			});
    }])
  ;
})();
