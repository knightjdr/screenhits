(function() {
	'use strict';

	angular.module('app')
    .service('helperHTTP', ['credentials', '__env', 'helperDialog', '$http', function(credentials, __env, helperDialog, $http) {
			this.set = function(endpoint, object, successCallback, failureCallback) {
        var user = credentials.get();
        $http({
					method: 'POST',
					url: __env.apiUrl + '/' + endpoint,
					headers: {'Content-Type': 'application/json', 'user': JSON.stringify(user)},
          data: object
				})
				.then(function successPost(response) {
					if(!response.data.status) {
						successCallback(response);
					} else {
						failureCallback(response);
					}
				}, function errorPost() {
          helperDialog.alert('Connection error', 'The server could not be reached.');
				});
			};
		}])
  ;
})();
