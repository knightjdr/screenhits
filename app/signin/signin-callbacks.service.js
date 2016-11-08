(function() {
	'use strict';

	angular.module('app')
    .service('signinCallbacks', ['credentials', 'helperDialog', 'helperHTTP', '$rootScope', function(credentials, helperDialog, helperHTTP, $rootScope) {
      var data = {};
			this.success = function(authResult) {
				//process google authResult for token
        for(var key in authResult) {
           if(typeof(authResult[key]) === 'object') {
             if(authResult[key].hasOwnProperty('access_token')) {
               data.token = authResult[key].access_token;
             }
           }
         }
				 //signinCallbacks
				 var signinFailure = function(response) {
					 var auth2 = gapi.auth2.getAuthInstance();
					 auth2.disconnect();
					 helperDialog.alert('Sign-in failed', response.data.message);
				 };
				 var signinSuccess = function(response) {
					 credentials.set(response.data.user);
					 $rootScope.$broadcast('signin:updated', {text: 'Signed in'});
				 };
				 //check user is authorized
				 helperHTTP.set('login', data, signinSuccess, signinFailure);
			};
			this.failure = function(err) {
				credentials.set({});
			};
		}])
  ;
})();
