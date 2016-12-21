(function (window) {
  window.__env = window.__env || {};
  //API url
  window.__env.apiUrl = 'http://localhost:8003';
  //base url
  window.__env.baseUrl = '/';
  //support e-mail
  window.__env.supportEmail = 'jknight@lunenfeld.ca';
  //support name
  window.__env.supportName = 'James Knight';
  //gapi client ID
  window.__env.clientID = '498894175021-2v85kl2dnmnsqsaqo94a5ls6gsjbj7u4';

}(this));

angular.module('custom.scrollbar', [])
  .provider('scrollbarConfig', function adrConfigProvider(){
    //defaults
    var defaultConfig = {
      backgroundColor: 'rgba(255, 255, 255, 0)',
      borderRadius: 10,
      boxShadow: 'inset 0 0 3px #37474f',
      buttonBorderRadius: 10,
      buttonColor: '#bd9a65',
      display: 'none',
      offsetRight: 12,
      rightOffset: 2,
      width: 12
    };
    var config = angular.extend({}, defaultConfig);
    this.$get = [function(){
      return {
        backgroundColor: config.backgroundColor,
        borderRadius: config.borderRadius,
        boxShadow: config.boxShadow,
        buttonBorderRadius: config.buttonBorderRadius,
        buttonColor: config.buttonColor,
        display: config.display,
        offsetRight: config.offsetRight,
        rightOffset: config.rightOffset,
        width: config.width
      };
    }];
  })
  .directive('customScrollbar', ['$document', 'scrollbarConfig', '$timeout', '$window', function($document, scrollbarConfig, $timeout, $window) {
    return {
      restrict: 'A',
      link: function(scope, element, attr) {
        var container = element[0].firstChild;
        var containerHeight;
        var heightStable;
        var init = false;
        var paddingBottom = parseInt($window.getComputedStyle(element[0]).getPropertyValue('padding-bottom').replace(/px/, ''));
        var paddingTop = parseInt($window.getComputedStyle(element[0]).getPropertyValue('padding-top').replace(/px/, ''));
        var parentHeight;
        var parentHeightNoPadding;
        var resizeStable;
        var scalingFactor;
        var scrollButton;
        var scrollbarElement;
        var scrollbarHeight;
        var scrollButtonHeight;
        var scrollButtonSpacer;
        var setParentDetails = function() {
          containerHeight = container.offsetHeight;
          parentHeight = element[0].offsetHeight;
          parentHeightNoPadding = parentHeight - paddingBottom - paddingTop;
          scalingFactor = containerHeight / parentHeightNoPadding;
        };
        var setScrollbarSettings = function() {
          scrollbarHeight = parentHeight - paddingBottom - paddingTop;
          scrollButtonHeight = scrollbarHeight * (scrollbarHeight / containerHeight);
          scrollButtonSpacer = scrollbarHeight - scrollButtonHeight;
        };
        var adjustScrollDetails = function() {
          scrollbarElement.style.height = scrollbarHeight + 'px';
          scrollButton.style.height = scrollButtonHeight + 'px';
          var containerTop = parseInt(container.style.top.replace(/px/, ''));
          var currentTop = parseInt(scrollButton.style.top.replace(/px/, ''));
          if(currentTop + scrollButtonHeight > scrollbarHeight) {
            container.style.top = containerTop + (currentTop - scrollButtonSpacer) + 'px';
            scrollButton.style.top = scrollButtonSpacer + 'px';
          }
        };
        var initialize = function() {
          setParentDetails();
          setScrollbarSettings();
          //set container defaults
          container.style.top = '0px';
          //create scrollbar
          scrollbarElement = document.createElement('div');
          scrollbarElement.className = 'custom-scrollbar';
          scrollbarElement.style.backgroundColor = scrollbarConfig.backgroundColor;
          scrollbarElement.style.borderRadius = scrollbarConfig.borderRadius + 'px';
          scrollbarElement.style.boxShadow = scrollbarConfig.boxShadow;
          scrollbarElement.style.cursor = 'default';
          scrollbarElement.style.display = scrollbarConfig.display;
          scrollbarElement.style.height = scrollbarHeight + 'px';
          scrollbarElement.style.position = 'absolute';
          scrollbarElement.style.right = scrollbarConfig.rightOffset + 'px';
          scrollbarElement.style.top = paddingTop + 'px';
          scrollbarElement.style.width = scrollbarConfig.width + 'px';
          element[0].appendChild(scrollbarElement);
          //create scrollbutton
          scrollButton = document.createElement('div');
          scrollButton.style.borderRadius = scrollbarConfig.buttonBorderRadius + 'px';
          scrollButton.style.boxShadow = scrollbarConfig.boxShadow;
          scrollButton.style.backgroundColor = scrollbarConfig.buttonColor;
          scrollButton.style.cursor = 'default';
          scrollButton.style.height = scrollButtonHeight + 'px';
          scrollButton.style.position = 'absolute';
          scrollButton.style.top = '0px';
          scrollButton.style.width = scrollbarConfig.width + 'px';
          scrollbarElement.appendChild(scrollButton);
        };
        //bind behaviour
        var mousedown = false;
        var mouseover = false;
        var position = {};
        var mouseoverFunction = function() {
          mouseover = true;
          if(containerHeight > parentHeightNoPadding) {
            scrollbarElement.style.display = 'inline';
          } else {
            scrollbarElement.style.display = 'none';
          }
          scope.$apply();
        };
        var mouseoutFunction = function() {
          mouseover = false;
          if(!mousedown) {
            scrollbarElement.style.display = 'none';
          }
          scope.$apply();
        };
        var mousemoveFunction = function($event) {
        	var dy = $event.clientY - position.mouseY;
          position.mouseY = $event.clientY;
          var containerNewPosition = parseInt(container.style.top.replace(/px/, '')) - (scalingFactor * dy);
          var newPosition = parseInt(scrollButton.style.top.replace(/px/, '')) + dy;
          if(newPosition < 0) {
            newPosition = 0;
            containerNewPosition = 0;
          }
          if(newPosition > scrollButtonSpacer) {
            newPosition = scrollButtonSpacer;
            containerNewPosition = -(scalingFactor * scrollButtonSpacer);
          }
          scrollButton.style.top = newPosition  + 'px';
          container.style.top = containerNewPosition + 'px';
          scope.$apply();
        	return false;
        };
        var mouseupFunction = function() {
          mousedown = false;
          $document.unbind('mousemove', mousemoveFunction);
         	$document.unbind('mouseup', mouseupFunction);
          if(!mouseover) {
            scrollbarElement.style.display = 'none';
          }
          scope.$apply();
        };
        var mousedownFunction = function($event) {
          position.mouseY = $event.clientY;
          mousedown = true;
          $document.bind('mousemove', mousemoveFunction);
          $document.bind('mouseup', mouseupFunction);
          scope.$apply();
          return false;
        };
        var wheelFunction = function($event) {
          var containerNewPosition = parseInt(container.style.top.replace(/px/, '')) - (scalingFactor * $event.deltaY);
          var newPosition = parseInt(scrollButton.style.top.replace(/px/, '')) + $event.deltaY;
          if(newPosition < 0) {
            newPosition = 0;
            containerNewPosition = 0;
          }
          if(newPosition > scrollButtonSpacer) {
            newPosition = scrollButtonSpacer;
            containerNewPosition = -(scalingFactor * scrollButtonSpacer);
          }
          scrollButton.style.top = newPosition  + 'px';
          container.style.top = containerNewPosition  + 'px';
          scope.$apply();
        };
        var bindBehaviours = function(bind) {
          if(bind) {
            element.bind('mouseover', mouseoverFunction);
            element.bind('mouseout', mouseoutFunction);
            element.bind('wheel', wheelFunction);
            scrollButton.addEventListener('mousedown', mousedownFunction);
          } else {
            element.unbind('mouseover', mouseoverFunction);
            element.unbind('mouseout', mouseoutFunction);
            element.unbind('wheel', wheelFunction);
            scrollButton.removeEventListener('mousedown', mousedownFunction);
            container.style.top = '0px';
            scrollbarElement.style.display = 'none';
          }
        };
        //check if scrollbar should be displayed
        var checkSize = function() {
          setParentDetails();
          setScrollbarSettings();
          adjustScrollDetails();
          if(containerHeight > parentHeightNoPadding) {
            bindBehaviours(true);
          } else {
            bindBehaviours(false);
          }
        };
        //check if visisble when initialized
        scope.$watch(function() { return element.attr('class'); }, function(classes) {
          if(classes.match(/ng-hide/) === null) {
            if(!init) {
              initialize();
              init = true;
            }
          }
        });
        //watch container size
        scope.$watch(function() { if(container) { return container.offsetHeight; } }, function() {
          if(init) {
            checkSize();
          }
        });
        //update container size explicitely, as sometimes digests are not applied immediately
        scope.$on('height:updated', function() {
          var classes = element.attr('class');
          if(classes.match(/ng-hide/) === null) {
            $timeout(function() {
              checkSize();
            });
          }
        });
        //on window resize
        angular.element($window).bind('resize', function() {
          if(init) {
            $timeout.cancel(resizeStable);
						resizeStable = $timeout(function() {
							checkSize();
						}, 500);
          }
        });
      }
    };
  }])
;

(function() {
	'use strict';

	angular
		.module('app', ['custom.scrollbar', 'ct.ui.router.extras', 'ngAnimate', 'ngMaterial', 'ngMessages', 'ngSanitize', 'PPVN', 'ui.router'])
	;
})();

(function() {
	'use strict';

	angular
    .module('app')
		.config(['$mdThemingProvider', function($mdThemingProvider) {
      $mdThemingProvider.theme('default')
      .primaryPalette('blue-grey')
      .accentPalette('orange')
			.foregroundPalette['3'] = '#455a64';
    }])
		.constant('__env', window.__env)
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
						'projects': {
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
				.state('root.projects', {
					url: 'projects',
					views: {
						'analysis': {
							templateUrl: 'app/profile/analysis/analysis.html'
						},
						'details': {
							templateUrl: 'app/profile/project/project.html'
						},
						'help': {
							templateUrl: 'app/profile/help/help.html'
						},
						'introduction': {
							templateUrl: 'app/profile/introduction.html'
						},
						'new': {
							templateUrl: 'app/profile/project/project-new.html'
						},
						'search': {
							templateUrl: 'app/profile/search/search.html'
						}
					}
				})
				.state('root.projects.analysis', {
					url: '/analysis'
				})
				.state('root.projects.details', {
					url: '/details?project'
				})
				.state('root.projects.help', {
					url: '/help'
				})
				.state('root.projects.new', {
					url: '/new'
				})
				.state('root.projects.search', {
					url: '/search'
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
            collapseTarget.style.display = 'block';
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
		.directive('flipMenu', ['$timeout', function ($timeout) {
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
						targetElement.style.whiteSpace = 'nowrap';
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
								$timeout(function() {
									targetElement.style.whiteSpace = 'normal';
								}, 500);
              } else {
                targetElement.style.maxHeight = '0px';
								targetElement.style.minWidth = '0px';
                targetElement.style.transform = 'rotateY(90deg)';
								targetElement.style.visibility = 'hidden';
                targetElement.style.webkitTransform = 'rotateY(90deg)';
								targetElement.style.width = '0px';
								targetElement.style.whiteSpace = 'nowrap';
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
    .directive('compile', ['$compile', function($compile) {
			//tweaked from here http://stackoverflow.com/questions/17417607/angular-ng-bind-html-and-directive-within-it
      return function(scope, element, attrs) {
        var ensureCompileRunsOnce = scope.$watch(
          function(scope) {
            return scope.$eval(attrs.compile);
          },
          function(value) {
            element.html(value);
            $compile(element.contents())(scope);
            ensureCompileRunsOnce();
          }
        );
      };
		}])
  ;
})();

(function() {
	'use strict';

	angular.module('app')
    .service('helperDialog', ['$mdDialog', function($mdDialog) {
			this.alert = function(title, message) {
       	$mdDialog.show({
      		clickOutsideToClose: true,
					controller: 'alert',
					controllerAs: 'vm',
					locals: {
						message: message,
          	title: title
         	},
        	parent: angular.element(document.body),
         	templateUrl: 'app/dialogs/alert/alert.html'
      	});
			};
		}])
  ;
})();

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
			this.get = function(endpoint, object, successCallback, failureCallback) {
        var user = credentials.get();
				var params = '?';
				for(var key in object) {
					params += key + '=' + object[key] + '&';
				}
        $http({
					method: 'GET',
					url: __env.apiUrl + '/' + endpoint + '/' + params,
					headers: {'Content-Type': 'application/json', 'user': JSON.stringify(user)}
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

(function() {
	'use strict';

	angular.module('app')
    .service('helperObject', [function() {
			this.notEmpty = function(object) {
        for(var prop in object) {
          if(object.hasOwnProperty(prop)) {
            return true;
          }
        }
        return false;
			};
		}])
  ;
})();

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

(function() {
	'use strict';

	angular.module('app')
		.controller('alert', ['__env', 'helperReport', '$mdDialog', '$scope', 'message', 'title', function(__env, helperReport, $mdDialog, $scope, message, title) {
      var vm = this;
      vm.close = function() {
        $mdDialog.hide();
      };
      vm.message = message;
			vm.reportError = function(subject) {
				helperReport.mail(subject);
			};
			vm.supportName = __env.supportName;
      vm.title = title;
    }])
  ;
})();

(function() {
	'use strict';

	angular.module('app')
		.controller('404', ['__env', 'helperReport', '$scope', '$window', function (__env, helperReport, $scope, $window) {
      var vm = this;
			vm.supportName = __env.supportName;
      vm.reportError = function(subject) {
				helperReport.mail(subject);
			};
    }])
  ;
})();

(function() {
	'use strict';

	angular.module('app')
    .service('projects', ['$rootScope', function($rootScope) {
			var currProject;
      var projects = [];
      this.add = function(data) {
				projects.push(data);
				$rootScope.$broadcast('projects:updated', projects);
			};
			this.get = function() {
				return projects;
			};
			this.getCurrent = function() {
				return currProject;
			};
      this.set = function(data) {
        projects = JSON.parse(JSON.stringify(data));
        $rootScope.$broadcast('projects:updated', projects);
      };
			this.setCurrent = function(project) {
				currProject = project;
				$rootScope.$broadcast('project:set', currProject);
			};
			this.update = function(project, key, data) {
				var index = projects.map(function(o) { return o._id; }).indexOf(project);
        projects[index][key] = data;
        $rootScope.$broadcast('projects:updated', projects);
      };
		}])
  ;
})();

(function() {
	'use strict';

	angular.module('app')
    .service('screens', ['$rootScope', function($rootScope) {
			var currScreen;
      var screens = [];
      this.add = function(data) {
				screens.push(data);
				$rootScope.$broadcast('screens:updated', screens);
			};
			this.get = function() {
				return screens;
			};
			this.getCurrent = function() {
				return currScreen;
			};
      this.set = function(data) {
        screens = data;
        $rootScope.$broadcast('screens:updated', screens);
      };
			this.setCurrent = function(screen) {
				currScreen = screen;
				$rootScope.$broadcast('screen:set', currScreen);
			};
			this.update = function(screen, key, data) {
				var index = screens.map(function(o) { return o._id; }).indexOf(screen);
        screen[index][key] = data;
        $rootScope.$broadcast('screens:updated', screens);
      };
		}])
  ;
})();

(function() {
	'use strict';

	angular.module('app')
    .service('signinCallbacks', ['credentials', 'helperDialog', 'helperHTTP', 'projects', '$rootScope', function(credentials, helperDialog, helperHTTP, projects, $rootScope) {
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
					 projects.set(response.data.projects);
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

(function() {
	'use strict';

	angular.module('app')
    .service('signoutUnload', ['helperHTTP', '$window', function(helperHTTP, $window) {
      $window.onbeforeunload = function () {
				helperHTTP.set('logout', {}, function(){}, function(){});
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
		.controller('signin', ['__env', '$scope', '$state', '$timeout', function (__env, $scope, $state, $timeout) {
      var vm = this;
			vm.clientID = __env.clientID;
      vm.signedIn = false;
			vm.signedInText = 'Sign in';
      //watch for credential changes
      $scope.$on('credentials:updated', function(event, data) {
        if(data.name) {
          vm.signedIn = true;
					vm.user = data.name;
					$timeout(function() {
          	$scope.$digest();
						$state.go('root.projects');
					});
        } else {
          vm.signedIn = false;
					$timeout(function() {
          	$scope.$digest();
					});
        }
      });
			//watch for text changes
			$scope.$on('signin:updated', function(event, data) {
        if(data.text) {
          vm.signedInText = data.text;
          $timeout(function() {
						$scope.$digest();
					});
        }
      });
    }])
  ;
})();

(function() {
	'use strict';

	angular.module('app')
		.controller('profile', ['credentials', 'helperHTTP', 'projects', '$scope', 'screens', '$state', '$timeout', function (credentials, helperHTTP, projects, $scope, screens, $state, $timeout) {
      var vm = this;
			vm.newProject = function() {
				$state.go('root.projects.new');
				angular.element(document.getElementById('projects-button')).triggerHandler('click');
			};
			vm.projects = [];
			vm.screens = [];
			vm.selectProject = function(project) {
				if(!vm.project || vm.project !== project) {
					vm.experiment = '';
					vm.project = project;
					vm.sample = '';
					vm.screen = '';
					projects.setCurrent(project);
					//get screen details
					var screenSuccess = function(response) {
						screens.set(response.data.screens);
						vm.screens = response.data.screens;
						$timeout(function() {
							$scope.$digest();
						});
					};
					var screenFailure = function(response) {
						helperDialog.alert('Error', response.data.message);
					};
					helperHTTP.get('project/screen', {project: project._id}, screenSuccess, screenFailure);
				}
				//change state
				$state.go('root.projects.details', {project: project._id});
				angular.element(document.getElementById('projects-button')).triggerHandler('click');
			};
			$scope.$on('credentials:updated', function(event, data) {
				if(data.name) {
					vm.user = data.name;
					$timeout(function() {
						$scope.$digest();
					});
				}
			});
			//after project added
			$scope.$on('projects:updated', function(event, data) {
				vm.projects = data;
				$timeout(function() {
					$scope.$digest();
				});
			});
			//get screen details
			$scope.$on('screens:updated', function(event, data) {
				vm.screens = data;
				$timeout(function() {
					$scope.$digest();
				});
			});
    }])
  ;
})();

(function() {
	'use strict';

	angular.module('app')
		.controller('project', ['$rootScope', function ($rootScope) {
      var vm = this;
      vm.show = '';
			vm.showChild = function(id) {
				vm.show = id;
				$rootScope.$broadcast('height:updated');
			};
    }])
  ;
})();

(function() {
	'use strict';

	angular.module('app')
		.controller('projectNew', ['credentials', 'helperHTTP', 'projects', '$scope', '$timeout', function (credentials, helperHTTP, projects, $scope, $timeout) {
      var vm = this;
      vm.form = {};
			vm.partialReset = function () {
				$scope.form.name = '';
				$scope.form.description = '';
				$scope.form.$setPristine();
				$scope.form.$setUntouched();
        vm.form = {};
			};
			vm.reset = function () {
				$scope.form.name = '';
				$scope.form.description = '';
				$scope.form.$setPristine();
				$scope.form.$setUntouched();
        vm.form = {};
        vm.message = '';
			};
			vm.submit = function(valid, form) {
        vm.message = '';
        if(valid) {
          var user = credentials.get();
          var formObject = {};
          formObject.creator = user.name;
          formObject.description = form.description;
          formObject.title = form.name;
          var success = function(response) {
            vm.reset();
						vm.message = response.data.message;
						projects.add(response.data.project);
						$timeout(function() {
							vm.message = '';
						}, 10000);
          };
          var failure = function(response) {
            vm.message = response.data.message;
						$timeout(function() {
							vm.message = '';
						}, 10000);
          };
          helperHTTP.set('project', formObject, success, failure);
        }
			};
    }])
  ;
})();

(function() {
	'use strict';

	angular.module('app')
		.controller('projectManagement', ['helperHTTP', 'helperObject', 'projects', '$scope', '$timeout', function (helperHTTP, helperObject, projects, $scope, $timeout) {
      var vm = this;
			vm.addUsers = function(project, currentUsers, newUsers, newPermissions) {
				var toAdd = [];
				if(currentUsers) {
					toAdd = currentUsers;
				}
				for(var i = 0, iLen = vm.searchResults.length; i < iLen; i++) {
					if(newUsers[i]) {
						toAdd.push({name: vm.searchResults[i].name, lab: vm.searchResults[i].lab, permission: newPermissions[i]});
					}
				}
				var success = function(response) {
					projects.update(project, 'users', toAdd);
					vm.addUsersMessage = response.data.message;
					$timeout(function() {
						vm.addUsersMessage = '';
					}, 10000);
				};
				var failure = function(response) {
					vm.addUsersMessage = response.data.message;
					$timeout(function() {
						vm.addUsersMessage = '';
					}, 10000);
				};
				helperHTTP.set('project/users', {project: project, users: toAdd}, success, failure);
			};
			vm.currentPermissions = [];
			vm.manage = false;
			vm.newPermissions = [];
			vm.newUsers = [];
			vm.reset = function() {
				$scope.form.email = '';
				$scope.form.$setPristine();
				$scope.form.$setUntouched();
				vm.searchUser = {};
			};
			vm.searchUser = {};
			//vm.searchResults = [{name: 'James Knight', lab: 'Gingras'}, {name: 'Someone', lab: 'Gingras'}];
			vm.submit = function(valid, form) {
        if(valid && helperObject.notEmpty(form)) {
					vm.message = '';
					var formObject = form;
          var success = function(response) {
            vm.reset();
						if(response.data.users.length > 0) {
							vm.searchResults = response.data.users;
						} else {
							vm.message = 'No users matched your search.';
							$timeout(function() {
								vm.message = '';
							}, 10000);
						}
          };
          var failure = function(response) {
						vm.message = response.data.message;
						$timeout(function() {
							vm.message = '';
						}, 10000);
          };
          helperHTTP.get('project/users', formObject, success, failure);
        }
			};
			vm.updateUsers = function(project, currentUsers, currentPermissions, remove) {
				console.log(project, currentUsers, currentPermissions, remove);
				for(var i = currentUsers.length - 1; i >= 0; i--) {
					if(remove && remove[i]) {
						currentUsers.splice(i);
					} else {
						currentUsers[i].permission = currentPermissions[i];
					}
				}
				console.log(currentUsers);
				var success = function(response) {
					projects.update(project, 'users', currentUsers);
					vm.manage = false;
				};
				var failure = function(response) {
					vm.updateUsersMessage = response.data.message;
					$timeout(function() {
						vm.updateUsersMessage = '';
					}, 10000);
				};
				helperHTTP.set('project/users', {project: project, users: currentUsers}, success, failure);
			};
    }])
  ;
})();

(function() {
	'use strict';

	angular.module('app')
		.controller('experimentManagement', ['credentials', 'helperDialog', 'helperHTTP', 'helperObject', '$http', 'projects', '$scope', '$timeout', function (credentials, helperDialog, helperHTTP, helperObject, $http, projects, $scope, $timeout) {
      var vm = this;
			vm.form = {};
			vm.formProtocol = {details: []};
      vm.protocolDetails = false;
      vm.protocolCreation = false;
			vm.reset = function() {
        $scope.form.comment = '';
        $scope.form.description = '';
        $scope.form.protocol = '';
				$scope.form.$setPristine();
				$scope.form.$setUntouched();
				vm.form = {};
			};
			vm.submit = function(valid, form, project, screen) {
        if(valid && helperObject.notEmpty(form)) {
					vm.message = '';
					var formObject = form;
          formObject.project = project;
          formObject.screen = screen;
          var success = function(response) {
            vm.reset();
            vm.message = response.data.message;
						$timeout(function() {
							vm.message = '';
						}, 10000);
          };
          var failure = function(response) {
						vm.message = response.data.message;
						$timeout(function() {
							vm.message = '';
						}, 10000);
          };
          helperHTTP.get('project/screen', formObject, success, failure);
        }
			};
			//get users protocols
			$scope.$on('project:set', function() {
				var protocolSuccess = function(response) {
					vm.protocols = response.data.protocols;
				};
				var protocolFailure = function(response) {
					helperDialog.alert('Error', response.data.message);
				};
				helperHTTP.get('project/protocols', {user: credentials.get().name, project: projects.getCurrent()._id}, protocolSuccess, protocolFailure);
			});
    }])
  ;
})();

(function() {
	'use strict';

	angular.module('app')
		.controller('screenManagement', ['helperDialog', 'helperHTTP', 'helperObject', '$http', '$rootScope', '$scope', 'screens', '$timeout', function (helperDialog, helperHTTP, helperObject, $http, $rootScope, $scope, screens, $timeout) {
      var vm = this;
			vm.form = {};
			vm.reset = function() {
        $scope.form.approach = '';
        $scope.form.cell = '';
        $scope.form.comment = '';
        $scope.form.condition = '';
        $scope.form.description = '';
        $scope.form.library = '';
				$scope.form.name = '';
        $scope.form.species = '';
        $scope.form.type = '';
				$scope.form.$setPristine();
				$scope.form.$setUntouched();
				vm.form = {};
			};
			vm.submit = function(valid, form, project, user) {
        if(valid && helperObject.notEmpty(form)) {
					vm.message = '';
					var formObject = form;
					formObject.creator = user;
          formObject.project = project;
          var success = function(response) {
            vm.reset();
            vm.message = response.data.message;
						screens.add(response.data.screen);
						$timeout(function() {
							vm.message = '';
						}, 10000);
          };
          var failure = function(response) {
						vm.message = response.data.message;
						$timeout(function() {
							vm.message = '';
						}, 10000);
          };
          helperHTTP.set('project/screen', formObject, success, failure);
        }
			};
      //get libaries
      $http.get('app/profile/screen/resources/options.json')
				.then(function successCallback(response) {
          vm.approaches = response.data.approaches;
          vm.cells = response.data.cells;
					vm.libraries = response.data.libraries;
          vm.species = response.data.species;
          vm.types = response.data.types;
          $timeout(function() {
          	$scope.$digest();
					});
				}, function errorCallback(response) {
					helperDialog.alert('Resource error', 'Library information could not be retrieved.');
				})
			;
    }])
  ;
})();
