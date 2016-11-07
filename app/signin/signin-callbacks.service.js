(function() {
	'use strict';

	angular.module('app')
    .service('signinCallbacks', ['credentials', 'helperDialog', 'helperHTTP', '$rootScope', function(credentials, helperDialog, helperHTTP, $rootScope) {
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
				 var signinFailure = function(response) {
					 var auth2 = gapi.auth2.getAuthInstance();
					 auth2.disconnect();
					 helperDialog.alert('Sign-in failed', response.data.message);
				 };
				 var signinSuccess = function(response) {
					 credentials.set(response.data.user);
					 $rootScope.$broadcast('signin:updated', {text: 'Signed in'});
				 };
				 helperHTTP.set('login', data, signinSuccess, signinFailure);
			};
			this.failure = function(err) {
				credentials.set({});
			};
		}])
  ;
})();
