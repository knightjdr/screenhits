(function() {
	'use strict';

	angular
    .module('app')
    .run(['$state', '$rootScope', function($state, $rootScope) {
  	  		$rootScope.$state = $state;
		}])
    .config(['$locationProvider', '$stateProvider', '$urlRouterProvider', function($locationProvider, $stateProvider, $urlRouterProvider) {
			$urlRouterProvider
				.otherwise("/404")
			;

			$stateProvider
        .state('root', {
          url: "/",
					sticky: true,
					dsr: true,
					views: {
						'admin': {
							templateUrl: "app/admin/admin.html"
						},
						'error': {
							templateUrl: "app/404/404.html"
						},
						'home': {
							templateUrl: "app/home/home.html"
						},
						'treasure': {
							templateUrl: "app/treasure/treasure.html"
						}
					}
       	})
				.state('root.admin', {
         	url: "admin"
       	})
				.state('root.error', {
					url: "404"
				})
				.state('root.home', {
					url: ""
				})
				.state('root.treasure', {
         	url: "treasure"
       	})
			;

			$locationProvider.html5Mode(true);

		}])
	;
})();
