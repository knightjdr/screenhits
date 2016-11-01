(function() {
	'use strict';

	angular.module('app')
		.directive('collapse', [function () {
      return {
        restrict: 'A',
        link: function (scope, element, attrs) {
          var containerClass = attrs.collapse;
          var container = element[0].closest('.' + containerClass);
          var closeIcons = container.querySelector('.collapse-icons-other');
          var containerHeader = container.querySelector('.collapse-header');
          var collapseTarget = container.querySelector('.collapse-container');
          var expandButton = container.querySelector('[expand=' + containerClass +']');
          container.style.marginRight = '25px';
          collapseTarget.style.transition = 'all 500ms';
          collapseTarget.style.webkitTransition = 'all 500ms';
          containerHeader.style.transition = 'all 500ms';
          collapseTarget.style.webkitTransition = 'all 500ms';
          element.bind('click', function(event) {
            container.style.marginRight = '0px';
            closeIcons.style.display = 'none';
            collapseTarget.style.display = 'none';
            containerHeader.style.display = 'block';
            element[0].style.display = 'none';
            expandButton.style.display = 'inline';
            //destroy md-tooltip in case its new position is wrong
            var tooltip = document.getElementsByTagName('md-tooltip')[0];
            if(tooltip) {
              tooltip.remove();
            }
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
          var closeIcons = container.querySelector('.collapse-icons-other');
          var containerHeader = container.querySelector('.collapse-header');
          var collapseButton = container.querySelector('[collapse=' + containerClass +']');
          var collapseTarget = container.querySelector('.collapse-container');
          element[0].style.display = 'none';
          element.bind('click', function(event) {
            container.style.marginRight = '25px';
            closeIcons.style.display = 'inline';
            collapseButton.style.display = 'inline';
            collapseTarget.style.display = 'inline';
            containerHeader.style.display = 'none';
            element[0].style.display = 'none';
            //destroy md-tooltip in case its new position is wrong
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
