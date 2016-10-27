(function() {
	'use strict';

	angular.module('app')
		.controller('404', ['__env', '$scope', '$window', function (__env, $scope, $window) {
      var vm = this;
      vm.supportEmail = __env.email;
      vm.reportError = function(subject) {
				vm.windowLocation = 'mailto:'+ vm.supportEmail + '?subject=' + subject;
        window.location.href = vm.windowLocation;
      };
    }])
  ;
})();
