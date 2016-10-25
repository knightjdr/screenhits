(function() {
	'use strict';

	angular.module('app')
		.controller('404', ['$scope', '$state', '$window', function ($scope, $state, $window) {
      var vm = this;
      vm.supportEmail = 'jknight@lunenfeld.ca';
      vm.reportError = function(subject) {
        $window.open("mailto:"+ vm.supportEmail + "?subject=" + subject, "_self");
      };
    }])
  ;
})();
