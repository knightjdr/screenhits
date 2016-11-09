(function() {
	'use strict';

	angular.module('app')
    .service('signoutUnload', ['helperHTTP', '$window', function(helperHTTP, $window) {
      $window.onbeforeunload = function (e) {
				helperHTTP.set('logout', {}, function(){}, function(){});
        var auth2 = gapi.auth2.getAuthInstance();
        auth2.disconnect().then(function () {
        });
      };
		}])
    .run(['signoutUnload', function(signoutUnload) {}])
  ;
})();
