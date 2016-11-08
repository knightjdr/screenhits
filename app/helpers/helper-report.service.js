(function() {
	'use strict';

	angular.module('app')
    .service('helperReport', ['__env', '$window', function(__env, $window) {
			this.mail = function(subject) {
        var windowLocation = 'mailto:'+ __env.supportEmail + '?subject=' + subject;
        window.location.href = windowLocation;
			};
		}])
  ;
})();
