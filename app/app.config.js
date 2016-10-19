(function() {
	'use strict';

	angular
    .module('app')
    .config(['$mdThemingProvider', function($mdThemingProvider) {
      $mdThemingProvider.theme('default')
      .primaryPalette('blue-grey')
      .accentPalette('orange');
    }])
	;
})();
