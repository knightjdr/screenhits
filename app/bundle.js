(function() {
	'use strict';

	angular
		.module('app', ['ct.ui.router.extras', 'ngMaterial', 'PPVN', 'ui.router'])
	;
})();

(function() {
	'use strict';

	angular
    .module('app')
    .config(['$mdThemingProvider', function($mdThemingProvider) {
      $mdThemingProvider.theme('default')
      .primaryPalette('blue-grey')
      .accentPalette('orange');
    }])
	;
})();

(function() {
	'use strict';

	angular
    .module('app')
    .run(['$state', '$rootScope', function($state, $rootScope) {
  	  		$rootScope.$state = $state;
		}])
    .config(['$locationProvider', '$stateProvider', '$urlRouterProvider', function($locationProvider, $stateProvider, $urlRouterProvider) {
			$urlRouterProvider
				.otherwise("/404")
			;

			$stateProvider
        .state('root', {
          url: "/",
					sticky: true,
					dsr: true,
					views: {
						'admin': {
							templateUrl: "app/admin/admin.html"
						},
						'error': {
							templateUrl: "app/404/404.html"
						},
						'home': {
							templateUrl: "app/home/home.html"
						},
						'treasure': {
							templateUrl: "app/treasure/treasure.html"
						}
					}
       	})
				.state('root.admin', {
         	url: "admin"
       	})
				.state('root.error', {
					url: "404"
				})
				.state('root.home', {
					url: ""
				})
				.state('root.treasure', {
         	url: "treasure"
       	})
			;

			$locationProvider.html5Mode(true);

		}])
	;
})();

(function() {
	'use strict';

	angular.module('app')
		.controller('404', ['$scope', '$state', '$window', function ($scope, $state, $window) {
      var vm = this;
      vm.supportEmail = 'jknight@lunenfeld.ca';
      vm.reportError = function(subject) {
        $window.open("mailto:"+ vm.supportEmail + "?subject=" + subject, "_self");
      };
    }])
  ;
})();

(function() {
	'use strict';

	angular.module('app')
    .service('credentials', ['$rootScope', function($rootScope) {
      var user = {};
			this.get = function() {
				return user;
			};
			this.set = function(data) {
				user = data;
				$rootScope.$broadcast('credentials:updated', user);
			};
		}])
  ;
})();

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

/*
 * angular-google-plus-directive v0.0.2
 * ♡ CopyHeart 2013 by Jerad Bitner http://jeradbitner.com
 * Copying is an act of love. Please copy.
 * Modified by Boni Gopalan to include Google oAuth2 Login.
 * Modified by @barryrowe to provide flexibility in clientid, and rendering
 * Modified by James Knight
 */

(function() {
	'use strict';

	angular.module('app')
		.directive('googleSignin', ['signinCallbacks', function (signinCallbacks) {
         var ending = /\.apps\.googleusercontent\.com$/;
         return {
             restrict: 'A',
             link: function (scope, element, attrs) {
                 attrs.clientid += (ending.test(attrs.clientid) ? '' : '.apps.googleusercontent.com');
                 var defaults = {
									 access_type: 'offline',
									 clientid: attrs.clientid,
									 cookiepolicy: 'single_host_origin',
									 customtargetid: 'google-signin',
									 onfailure: signinCallbacks.failure,
									 onsuccess: signinCallbacks.success,
									 scope: 'email'
                 };

                 // Asynchronously load the G+ SDK and font
								 var links = document.getElementsByTagName('link')[0];
								 var gPlusFont = document.createElement('link');
                 gPlusFont.type = 'text/css';
                 gPlusFont.async = true;
								 gPlusFont.rel = 'stylesheet';
                 gPlusFont.href = 'https://fonts.googleapis.com/css?family=Roboto';
								 links.parentNode.insertBefore(gPlusFont, links);
								 var scripts = document.getElementsByTagName('script')[0];
                 var gPlusSource = document.createElement('script');
                 gPlusSource.type = 'text/javascript';
                 gPlusSource.async = true;
                 gPlusSource.src = 'https://apis.google.com/js/client:platform.js';
								 scripts.parentNode.insertBefore(gPlusSource, scripts);
								 gPlusSource.onload = function () {
									 gapi.load('auth2', function () {
										 var auth2 = gapi.auth2.init({
											 client_id: defaults.clientid,
											 cookie_policy: defaults.cookiepolicy
										 });
										 auth2.attachClickHandler(defaults.customtargetid, {}, defaults.onsuccess, defaults.onfailure);
									 });
                 }
							;
						}
         };
  		}])
		;
})();

(function() {
	'use strict';

	angular.module('app')
		.directive('googleSignout', ['credentials', '$rootScope', '$state', function (credentials, $rootScope, $state) {
      return {
        restrict: 'A',
        link: function (scope, element, attrs) {
          element.bind("click", function(e) {
            e.stopPropagation();
            var auth2 = gapi.auth2.getAuthInstance();
    				auth2.disconnect().then(function () {
              credentials.set({});
              $rootScope.$broadcast('signin:updated', {text: 'Sign in'});
            });
          });
        }
      };
    }])
  ;
})();

(function() {
	'use strict';

	angular.module('app')
		.controller('signin', ['$scope', 'credentials', function ($scope, credentials) {
      var vm = this;
      vm.signedIn = false;
			vm.signedInText = 'Sign in';
      //watch for credential changes
      $scope.$on('credentials:updated', function(event, data) {
        if(data.name) {
          vm.signedIn = true;
          $scope.$digest();
        } else {
          vm.signedIn = false;
          $scope.$digest();
        }
      });
			//watch for text changes
			$scope.$on('signin:updated', function(event, data) {
        if(data.text) {
          vm.signedInText = data.text;
          $scope.$digest();
        }
      });
    }])
  ;
})();
