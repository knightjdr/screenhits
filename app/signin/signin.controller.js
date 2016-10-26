(function() {
	'use strict';

	angular.module('app')
		.controller('signin', ['$scope', 'credentials', function ($scope, credentials) {
      var vm = this;
      vm.signedIn = false;
			vm.signedInText = 'Sign in';
      //watch for credential changes
      $scope.$on('credentials:updated', function(event, data) {
        if(data.name) {
          vm.signedIn = true;
          $scope.$digest();
        } else {
          vm.signedIn = false;
          $scope.$digest();
        }
      });
			//watch for text changes
			$scope.$on('signin:updated', function(event, data) {
        if(data.text) {
          vm.signedInText = data.text;
          $scope.$digest();
        }
      });
    }])
  ;
})();
