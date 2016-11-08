(function() {
	'use strict';

	angular.module('app')
		.controller('alert', ['__env', 'helperReport', '$mdDialog', '$scope', 'message', 'title', function(__env, helperReport, $mdDialog, $scope, message, title) {
      var vm = this;
      vm.close = function() {
        $mdDialog.hide();
      };
      vm.message = message;
			vm.reportError = function(subject) {
				helperReport.mail(subject);
			};
			vm.supportName = __env.supportName;
      vm.title = title;
    }])
  ;
})();
