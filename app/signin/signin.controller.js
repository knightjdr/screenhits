(function() {
	'use strict';

	angular.module('app')
		.controller('signin', ['__env', '$scope', '$state', '$timeout', function (__env, $scope, $state, $timeout) {
      var vm = this;
			vm.clientID = __env.clientID;
      vm.signedIn = false;
			vm.signedInText = 'Sign in';
      //watch for credential changes
      $scope.$on('credentials:updated', function(event, data) {
        if(data.name) {
          vm.signedIn = true;
					vm.user = data.name;
					$timeout(function() {
          	$scope.$digest();
						$state.go('root.projects');
					});
        } else {
          vm.signedIn = false;
					$timeout(function() {
          	$scope.$digest();
					});
        }
      });
			//watch for text changes
			$scope.$on('signin:updated', function(event, data) {
        if(data.text) {
          vm.signedInText = data.text;
          $timeout(function() {
						$scope.$digest();
					});
        }
      });
    }])
  ;
})();
