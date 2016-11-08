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
