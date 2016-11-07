(function() {
	'use strict';

	angular.module('app')
    .service('helperHTTP', ['credentials', 'helperDialog', '$http', '__env', function(credentials, helperDialog, $http, __env) {
			this.set = function(endpoint, object, successCallback, errorCallback) {
        var user = credentials.get();
        $http({
					method: 'POST',
					url: __env.apiUrl + '/' + endpoint,
					headers: {'Content-Type': 'application/json', user: user},
          data: object
				})
				.then(function successPost(response) {
					if(!response.data.status) {
						successCallback(response);
					} else {
						errorCallback(response);
					}
				}, function errorCallback() {
          helperDialog.alert('Connection error', 'The server could not be reached.');
				});
			};
		}])
  ;
})();
