(function() {
	'use strict';

	angular.module('app')
    .service('helperReport', ['__env', '$window', function(__env, $window) {
			this.mail = function(subject) {
        $window.location.href = 'mailto:'+ __env.supportEmail + '?subject=' + subject;
			};
		}])
  ;
})();
