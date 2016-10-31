(function() {
	'use strict';

	angular.module('app')
		.controller('profile', ['$scope', function ($scope) {
      var vm = this;
			vm.introduction = true;
			vm.user = 'Someone';
			vm.projects = [{
				title: 'Project 1',
				creator: 'Someone A',
				description: 'a project description',
				screens: [
					{
						approach: 'dropout',
						cellLine: 'HeLa',
						condition: 'drug treatment',
						creator: 'Someone A',
						experiments: [{
							details: 'time points and drug concentrations',
							experimenter: 'Someone C',
							protocols: {
								type: 'protocol.pdf'
							}
						}],
						library: 'library 1',
						species: 'Homo sapiens',
						title: 'Screen 1',
						type: 'knockout'
					},
					{
						approach: 'positive selection',
						cellLine: 'U2OS',
						condition: 'genetic alteraion',
						creator: 'Someone B',
						experiments: [{
							details: 'time points and drug concentrations',
							experimenter: 'Someone D',
							protocols: {
								type: 'protocol.pdf'
							}
						}],
						library: 'library 2',
						species: 'Homo sapiens',
						title: 'Screen 2',
						type: 'overexpression'
					}
				]
			}];
			vm.selectProject = function(project) {
				vm.project = project;
				vm.introduction = false;
				angular.element(document.getElementById('projects-button')).triggerHandler('click');
			};
    }])
  ;
})();
