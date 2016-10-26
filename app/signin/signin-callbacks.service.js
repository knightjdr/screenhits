(function() {
	'use strict';

	angular.module('app')
    .service('signinCallbacks', ['credentials', '$rootScope', function(credentials, $rootScope) {
      var data = {};
			this.success = function(authResult) {
        for(var key in authResult) {
           if(typeof(authResult[key]) === 'object') {
             if(authResult[key].hasOwnProperty('U3')) {
               data.email = authResult[key].U3;
             }
             if(authResult[key].hasOwnProperty('ig')) {
               data.name = authResult[key].ig;
             }
             if(authResult[key].hasOwnProperty('access_token')) {
               data.token = authResult[key].access_token;
             }
           }
         }
         credentials.set(data);
         $rootScope.$broadcast('signin:updated', {text: 'Signed in'});
			};
			this.failure = function(err) {
				credentials.set({});
			};
		}])
  ;
})();
