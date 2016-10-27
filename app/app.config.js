(function() {
	'use strict';

	angular
    .module('app')
		.constant('__env', window.__env)
    .config(['$mdThemingProvider', function($mdThemingProvider) {
      $mdThemingProvider.theme('default')
      .primaryPalette('blue-grey')
      .accentPalette('orange');
    }])
	;
})();
