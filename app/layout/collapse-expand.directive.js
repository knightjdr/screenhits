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
