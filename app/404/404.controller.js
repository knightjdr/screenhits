(function() {
	'use strict';

	angular.module('app')
		.controller('404', ['__env', 'helperReport', '$scope', '$window', function (__env, helperReport, $scope, $window) {
      var vm = this;
			vm.supportName = __env.supportName;
      vm.reportError = function(subject) {
				helperReport.mail(subject);
			};
    }])
  ;
})();
