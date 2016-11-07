(function() {
	'use strict';

	angular.module('app')
		.controller('alert', ['$mdDialog', '$scope', 'message', 'title', function($mdDialog, $scope, message, title) {
      var vm = this;
      vm.close = function() {
        $mdDialog.hide();
      };
      vm.message = message;
      vm.title = title;
    }])
  ;
})();
