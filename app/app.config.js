(function() {
	'use strict';

	angular
    .module('app')
		.config(['$mdThemingProvider', function($mdThemingProvider) {
      $mdThemingProvider.theme('default')
      .primaryPalette('blue-grey')
      .accentPalette('orange')
			.foregroundPalette['3'] = '#455a64';
    }])
		.constant('__env', window.__env)
	;
})();
