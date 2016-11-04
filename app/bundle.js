(function (window) {
  window.__env = window.__env || {};
  //API url
  window.__env.apiUrl = 'http://localhost:8003';
  //base url
  window.__env.baseUrl = '/';
  //support e-mail
  window.__env.email = 'jknight@lunenfeld.ca';
  //gapi client ID
  window.__env.clientID = '498894175021-2v85kl2dnmnsqsaqo94a5ls6gsjbj7u4';

}(this));

(function() {
	'use strict';

	angular
		.module('app', ['ngAnimate', 'ct.ui.router.extras', 'ngMaterial', 'PPVN', 'ui.router'])
	;
})();

(function() {
	'use strict';

	angular
    .module('app')
		.constant('__env', window.__env)
    .config(['$mdThemingProvider', function($mdThemingProvider) {
      $mdThemingProvider.theme('default')
      .primaryPalette('blue-grey')
      .accentPalette('orange')
			.foregroundPalette['3'] = '#455a64';
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
				.otherwise('/404')
			;

			$stateProvider
        .state('root', {
          url: '/',
					sticky: true,
					dsr: true,
					views: {
						'admin': {
							templateUrl: 'app/admin/admin.html'
						},
						'close': {
							templateUrl: 'app/404/close.html'
						},
						'error': {
							templateUrl: 'app/404/404.html'
						},
						'home': {
							templateUrl: 'app/home/home.html'
						},
						'profile': {
							templateUrl: 'app/profile/profile.html'
						},
						'treasure': {
							templateUrl: 'app/404/treasure.html'
						}
					}
       	})
				.state('root.admin', {
         	url: 'admin'
       	})
				.state('root.close', {
         	url: 'treasure'
				})
				.state('root.error', {
					url: '404'
				})
				.state('root.home', {
					url: ''
				})
				.state('root.profile', {
					url: 'profile'
				})
				.state('root.treasure', {
         	url: '0111010001110010011001010110000101110011011101010111001001100101'
       	})
			;

			$locationProvider.html5Mode(true);

		}])
	;
})();

(function() {
	'use strict';

	angular.module('app')
		.directive('collapse', [function () {
      return {
        restrict: 'A',
        link: function (scope, element, attrs) {
          var containerClass = attrs.collapse;
					var container = element[0].closest('.' + containerClass);
					var collapseTarget = container.querySelector('.collapse-container');
          var containerHeader = container.querySelector('.collapse-header');
          collapseTarget.style.transition = 'all 500ms';
          collapseTarget.style.webkitTransition = 'all 500ms';
          containerHeader.style.transition = 'all 500ms';
          containerHeader.style.webkitTransition = 'all 500ms';
          element.bind('click', function(event) {
						var closeIcons = container.querySelector('.collapse-icons-other');
						var expandButton = container.querySelector('[expand="' + containerClass +'"]');
						closeIcons.style.display = 'none';
            collapseTarget.style.display = 'none';
            containerHeader.style.display = 'block';
            element[0].style.display = 'none';	
            expandButton.style.display = 'inline';
          });
        }
      };
    }])
    .directive('expand', [function () {
      return {
        restrict: 'A',
        link: function (scope, element, attrs) {
          var containerClass = attrs.expand;
          var container = element[0].closest('.' + containerClass);
          element[0].style.display = 'none';
          element.bind('click', function(event) {
						var closeIcons = container.querySelector('.collapse-icons-other');
						var collapseButton = container.querySelector('[collapse="' + containerClass +'"]');
	          var collapseTarget = container.querySelector('.collapse-container');
						var containerHeader = container.querySelector('.collapse-header');
						closeIcons.style.display = 'inline';
            collapseButton.style.display = 'inline';
            collapseTarget.style.display = 'inline';
            containerHeader.style.display = 'none';
            element[0].style.display = 'none';
          });
        }
      };
    }])
  ;
})();

(function() {
	'use strict';

	angular.module('app')
		.directive('flipMenu', [function () {
      return {
        restrict: 'A',
        link: function (scope, element, attrs) {
          //get target element and desired height
          var target = attrs.flipMenu;
          var targetElement = document.getElementById(target);
          var height = attrs.flipMenuHeight;
					var width = attrs.flipMenuWidth;
          if(targetElement) {
            //set initial target style
            targetElement.style.maxHeight = '0px';
						targetElement.style.minWidth = '0px';
            targetElement.style.overflow = 'hidden';
            targetElement.style.transformOrigin= 'left center';
            targetElement.style.transform = 'rotateY(90deg)';
						targetElement.style.visibility = 'hidden';
            targetElement.style.webkitTransform = 'rotateY(90deg)';
						targetElement.style.width = '0px';
            //attach click
            element.bind('click', function() {
              if(targetElement.style.webkitTransform === 'rotateY(90deg)') {
								targetElement.style.transition = 'all 500ms';
                targetElement.style.maxHeight = height;
								targetElement.style.minWidth = width;
                targetElement.style.transform = 'rotateY(0deg)';
								targetElement.style.visibility = 'visible';
                targetElement.style.webkitTransform = 'rotateY(0deg)';
								targetElement.style.width = 'auto';
              } else {
                targetElement.style.maxHeight = '0px';
								targetElement.style.minWidth = '0px';
                targetElement.style.transform = 'rotateY(90deg)';
								targetElement.style.visibility = 'hidden';
                targetElement.style.webkitTransform = 'rotateY(90deg)';
								targetElement.style.width = '0px';
              }
            });
          }
        }
      };
    }])
  ;
})();

(function() {
	'use strict';

	angular.module('app')
		.directive('mdTooltipDestroy', [function () {
      return {
        restrict: 'A',
        link: function (scope, element, attrs) {
          element.bind('click', function(event) {
            var tooltip = document.getElementsByTagName('md-tooltip')[0];
            if(tooltip) {
              tooltip.remove();
            }
          });
        }
      };
    }])
  ;
})();

(function() {
	'use strict';

	angular.module('app')
		.controller('404', ['__env', '$scope', '$window', function (__env, $scope, $window) {
      var vm = this;
      vm.supportEmail = __env.email;
      vm.reportError = function(subject) {
				vm.windowLocation = 'mailto:'+ vm.supportEmail + '?subject=' + subject;
        window.location.href = vm.windowLocation;
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
    .run(['signoutUnload', function(signoutUnload) {}])
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
		.controller('signin', ['__env', '$scope', function (__env, $scope) {
      var vm = this;
			vm.clientID = __env.clientID;
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

(function() {
	'use strict';

	angular.module('app')
		.controller('profile', ['$scope', function ($scope) {
      var vm = this;
			vm.introduction = true;
			vm.location = 'main';
			vm.user = 'Someone';
			vm.projects = [{
				title: 'Project 1',
				created: 1478030151,
				creator: 'Someone A',
				description: 'a project description',
				projectid: 1,
				screens: [
					{
						approach: 'dropout',
						cellLine: 'HeLa',
						condition: 'drug treatment',
						created: 1478030151,
						creator: 'Someone A',
						experiments: [{
							created: 1478030151,
							details: 'time points and drug concentrations',
							experimenter: 'Someone C',
							experimentid: 1,
							projectid: 1,
							protocols: {
								type: 'protocol.pdf'
							},
							screenid: 1
						}],
						library: 'library 1',
						projectid: 1,
						screenid: 1,
						species: 'Homo sapiens',
						title: 'Screen 1',
						type: 'knockout'
					},
					{
						approach: 'positive selection',
						cellLine: 'U2OS',
						condition: 'genetic alteraion',
						created: 1478030151,
						creator: 'Someone B',
						experiments: [{
							created: 1478030151,
							details: 'time points and drug concentrations',
							experimenter: 'Someone D',
							experimentid: 2,
							projectid: 1,
							protocols: {
								type: 'protocol.pdf'
							},
							screenid: 2
						}],
						library: 'library 2',
						projectid: 1,
						screenid: 2,
						species: 'Homo sapiens',
						title: 'Screen 2',
						type: 'overexpression'
					}
				]
			}];
			vm.selectProject = function(project) {
				if(!vm.project || vm.project !== project) {
					vm.experiment = '';
					vm.project = project;
					vm.sample = '';
					vm.screen = '';
				}
				vm.introduction = false;
				vm.location = 'main';
				angular.element(document.getElementById('projects-button')).triggerHandler('click');
			};
    }])
  ;
})();

(function() {
	'use strict';

	angular.module('app')
		.controller('projectManagement', ['$scope', function ($scope) {
      var vm = this;
			vm.form = {
				addUser: {
					email: '',
					name: ''
				}
			};
    }])
  ;
})();
