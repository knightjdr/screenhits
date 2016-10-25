(function() {
	'use strict';

	angular.module('app')
    .service('signoutUnload', ['$window', function($window) {
      $window.onbeforeunload = function (e) {
        var auth2 = gapi.auth2.getAuthInstance();
        auth2.disconnect().then(function () {
        });
      };
		}])
    .run(['signoutUnload', function(signoutUnload) {
      // Must invoke the service at least once
    }])
  ;
})();
