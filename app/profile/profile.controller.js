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
			/*vm.projects = [{
  			title: 'Project 1',
  			created: 1478030151,
  			creator: 'Someone',
  			description: 'a project description',
  			_id: 1,
  			screens: [
    			{
						approach: 'Negative selection',
      			cellLine: 'HeLa',
      			condition: 'drug treatment',
      			created: 1478030151,
      			creator: 'Someone A',
      			experiments: [{
        			created: 1478030151,
        			details: 'time points and drug concentrations',
        			experimenter: 'Someone C',
        			experimentid: 1,
        			projectid: 1,
        			protocols: {
          			type: 'protocol.pdf'
        			},
        			screenid: 1
      			}],
						_id: 1,
      			library: 'library 1',
      			projectid: 1,
      			species: 'Homo sapiens',
      			title: 'Screen 1',
      			type: 'CRISPR'
    			},
    			{
      			approach: 'Positive selection',
      			cellLine: 'U2OS',
      			condition: 'genetic alteraion',
      			created: 1478030151,
      			creator: 'Someone B',
      			experiments: [{
        			created: 1478030151,
        			details: 'time points and drug concentrations',
        			experimenter: 'Someone D',
        			experimentid: 2,
        			projectid: 1,
        			protocols: {
          			type: 'protocol.pdf'
        			},
        			screenid: 2
      			}],
						_id: 2,
      			library: 'library 2',
      			projectid: 1,
      			species: 'Homo sapiens',
      			title: 'Screen 2',
      			type: 'CRISPR'
    			}
  			]
			}];
			vm.user = 'Someone';*/
    }])
  ;
})();
