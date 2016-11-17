(function() {
	'use strict';

	angular.module('app')
		.controller('profile', ['$scope', '$state', '$timeout', function ($scope, $state, $timeout) {
      var vm = this;
			vm.newProject = function() {
				$state.go('root.projects.new');
				angular.element(document.getElementById('projects-button')).triggerHandler('click');
			};
			//vm.projects = [];
			vm.selectProject = function(project) {
				if(!vm.project || vm.project !== project) {
					vm.experiment = '';
					vm.project = project;
					vm.sample = '';
					vm.screen = '';
				}
				$state.go('root.projects.details', {project: project._id});
				angular.element(document.getElementById('projects-button')).triggerHandler('click');
			};
			$scope.$on('credentials:updated', function(event, data) {
				if(data.name) {
					//vm.user = data.name;
					$timeout(function() {
						$scope.$digest();
					});
				}
			});
			$scope.$on('projects:updated', function(event, data) {
				vm.projects = data;
				$timeout(function() {
					$scope.$digest();
				});
			});
			vm.projects = [{
  			title: 'Project 1',
  			created: 1478030151,
  			creator: 'Someone',
  			description: 'a project description',
  			_id: 1,
  			screens: [
    			{
      			approach: 'dropout',
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
      			library: 'library 1',
      			projectid: 1,
      			screenid: 1,
      			species: 'Homo sapiens',
      			title: 'Screen 1',
      			type: 'knockout'
    			},
    			{
      			approach: 'positive selection',
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
      			library: 'library 2',
      			projectid: 1,
      			screenid: 2,
      			species: 'Homo sapiens',
      			title: 'Screen 2',
      			type: 'overexpression'
    			}
  			]
			}];
			vm.user = 'Someone';
    }])
  ;
})();
