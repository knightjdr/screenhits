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
          if(targetElement) {
            //set initial target style
            targetElement.style.maxHeight = '0px';
            targetElement.style.overflow = 'hidden';
            targetElement.style.transformOrigin= 'left center';
            targetElement.style.transform = 'rotateY(90deg)';
            targetElement.style.webkitTransform = 'rotateY(90deg)';
            //attach click
            element.bind('click', function() {
              if(targetElement.style.webkitTransform === 'rotateY(90deg)') {
                targetElement.style.transition = 'all 750ms';
                targetElement.style.maxHeight = height;
                targetElement.style.transform = 'rotateY(0deg)';
                targetElement.style.webkitTransform = 'rotateY(0deg)';
              } else {
                targetElement.style.maxHeight = '0px';
                targetElement.style.transform = 'rotateY(90deg)';
                targetElement.style.webkitTransform = 'rotateY(90deg)';
              }
              //destroy md-tooltip in case its new position is wrong
              var tooltip = document.getElementsByTagName('md-tooltip')[0];
              if(tooltip) {
                tooltip.remove();
              }
            });
          }
        }
      };
    }])
  ;
})();
