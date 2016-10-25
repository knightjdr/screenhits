(function() {
	'use strict';

	angular.module('app')
		.directive('googleSignout', ['credentials', '$state', function (credentials, $state) {
      return {
        restrict: 'A',
        link: function (scope, element, attrs) {
          element.bind("click", function(e) {
            e.stopPropagation();
            var auth2 = gapi.auth2.getAuthInstance();
    				auth2.disconnect().then(function () {
              credentials.set({});
              document.getElementsByClassName('google-text')[0].innerHTML = 'Sign in';
              $state.go('root.home');
            });
          });
        }
      };
    }])
  ;
})();
