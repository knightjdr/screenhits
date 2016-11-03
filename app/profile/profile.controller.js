(function() {
	'use strict';

	angular.module('app')
		.controller('profile', ['$scope', function ($scope) {
      var vm = this;
			vm.introduction = true;
			vm.location = 'main';
			vm.user = 'Someone';
			vm.projects = [{
				title: 'Project 1',
				created: 1478030151,
				creator: 'Someone A',
				description: 'a project description',
				projectid: 1,
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
			vm.selectProject = function(project) {
				vm.project = project;
				vm.introduction = false;
				angular.element(document.getElementById('projects-button')).triggerHandler('click');
			};
    }])
  ;
})();
