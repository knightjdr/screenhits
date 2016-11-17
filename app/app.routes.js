(function() {
	'use strict';

	angular
    .module('app')
    .run(['$state', '$rootScope', function($state, $rootScope) {
			$rootScope.$state = $state;
		}])
    .config(['$locationProvider', '$stateProvider', '$urlRouterProvider', function($locationProvider, $stateProvider, $urlRouterProvider) {
			$urlRouterProvider
				.otherwise('/404')
			;

			$stateProvider
        .state('root', {
          url: '/',
					sticky: true,
					dsr: true,
					views: {
						'admin': {
							templateUrl: 'app/admin/admin.html'
						},
						'close': {
							templateUrl: 'app/404/close.html'
						},
						'error': {
							templateUrl: 'app/404/404.html'
						},
						'home': {
							templateUrl: 'app/home/home.html'
						},
						'projects': {
							templateUrl: 'app/profile/profile.html'
						},
						'treasure': {
							templateUrl: 'app/404/treasure.html'
						}
					}
       	})
				.state('root.admin', {
         	url: 'admin'
       	})
				.state('root.close', {
         	url: 'treasure'
				})
				.state('root.error', {
					url: '404'
				})
				.state('root.home', {
					url: ''
				})
				.state('root.projects', {
					url: 'projects',
					views: {
						'analysis': {
							templateUrl: 'app/profile/analysis/analysis.html'
						},
						'details': {
							templateUrl: 'app/profile/project/project.html'
						},
						'help': {
							templateUrl: 'app/profile/help/help.html'
						},
						'introduction': {
							templateUrl: 'app/profile/introduction.html'
						},
						'new': {
							templateUrl: 'app/profile/project/project-new.html'
						},
						'search': {
							templateUrl: 'app/profile/search/search.html'
						}
					}
				})
				.state('root.projects.analysis', {
					url: '/analysis'
				})
				.state('root.projects.details', {
					url: '/details?project'
				})
				.state('root.projects.help', {
					url: '/help'
				})
				.state('root.projects.new', {
					url: '/new'
				})
				.state('root.projects.search', {
					url: '/search'
				})
				.state('root.treasure', {
         	url: '0111010001110010011001010110000101110011011101010111001001100101'
       	})
			;

			$locationProvider.html5Mode(true);

		}])
	;
})();
