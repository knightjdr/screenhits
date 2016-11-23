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
      topOffset: 2,
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
        topOffset: config.topOffset,
        width: config.width
      };
    }];
  })
  .directive('customScrollbar', ['$document', 'scrollbarConfig', '$window', function($document, scrollbarConfig, $window) {
    return {
      restrict: 'A',
      link: function(scope, element, attr) {
        var container;
        var parentHeight;
        var parentTop;
        var scrollButton;
        var scrollbarElement;
        var scrollbarHeight;
        var scrollbartopOffset = scrollbarConfig.topOffset;
        var scrollButtonHeight;
        var scrollButtonSpacer;
        var setParentDetails = function() {
          parentHeight = element[0].offsetHeight;
          parentTop = element[0].getBoundingClientRect().top;
        };
        var setScrollbarSettings = function() {
          scrollbarHeight = $window.innerHeight - parentTop - (4 * scrollbartopOffset);
          scrollButtonHeight = scrollbarHeight * (($window.innerHeight  - parentTop) / parentHeight);
          scrollButtonSpacer = scrollbarHeight - scrollButtonHeight;
        };
        var adjustScrollDetails = function() {
          scrollbarElement.style.height = scrollbarHeight + 'px';
          scrollbarElement.style.top = scrollbartopOffset + 'px';
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
          //set parent details
          element[0].style.position = 'relative';
          element[0].style.overflowY = 'hidden';
          //create container
          container = document.createElement('div');
          container.className = 'scroll-container';
          container.style.position = 'absolute';
          container.style.top = '0px';
          container.innerHTML = element[0].innerHTML;
          element[0].innerHTML = null;
          element[0].insertBefore(container, null);
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
          scrollbarElement.style.top = scrollbartopOffset + 'px';
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
          scrollbarElement.style.display = 'inline';
        };
        var mouseoutFunction = function() {
          mouseover = false;
          if(!mousedown) {
            scrollbarElement.style.display = 'none';
          }
        };
        var mousemoveFunction = function($event) {
        	var dy = $event.clientY - position.mouseY;
          position.mouseY = $event.clientY;
          var containerNewPosition = (parseInt(container.style.top.replace(/px/, '')) - dy);
          var newPosition = (parseInt(scrollButton.style.top.replace(/px/, '')) + dy);
          if(newPosition < 0) {
            newPosition = 0;
            containerNewPosition = 0;
          }
          if(newPosition > scrollButtonSpacer) {
            newPosition = scrollButtonSpacer;
            containerNewPosition = -scrollButtonSpacer;
          }
          scrollButton.style.top = newPosition  + 'px';
          container.style.top = containerNewPosition + 'px';
        	return false;
        };
        var mouseupFunction = function() {
          mousedown = false;
          $document.unbind('mousemove', mousemoveFunction);
         	$document.unbind('mouseup', mouseupFunction);
          if(!mouseover) {
            scrollbarElement.style.display = 'none';
          }
        };
        var mousedownFunction = function($event) {
          position.mouseY = $event.clientY;
          mousedown = true;
          $document.bind('mousemove', mousemoveFunction);
          $document.bind('mouseup', mouseupFunction);
          return false;
        };
        var wheelFunction = function($event) {
          var containerNewPosition = (parseInt(container.style.top.replace(/px/, '')) - $event.deltaY);
          var newPosition = (parseInt(scrollButton.style.top.replace(/px/, '')) + $event.deltaY);
          if(newPosition < 0) {
            newPosition = 0;
            containerNewPosition = 0;
          }
          if(newPosition > scrollButtonSpacer) {
            newPosition = scrollButtonSpacer;
            containerNewPosition = -scrollButtonSpacer;
          }
          scrollButton.style.top = newPosition  + 'px';
          container.style.top = containerNewPosition  + 'px';
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
          }
        };
        //check if scrollbar should be displayed
        var checkSize = function() {
          if(parentHeight + parentTop >= $window.innerHeight) {
            setScrollbarSettings();
            adjustScrollDetails();
            bindBehaviours(true);
          } else {
            bindBehaviours(false);
            container.style.top = '0px';
            scrollbarElement.style.display = 'none';
          }
        };
        //check if visisble
        scope.$watch(function() { return element.attr('class'); }, function(classes) {
          if(classes.match(/ng-hide/) !== null) {
            initialize();
            checkSize();
          }
        });
        //on resize
        angular.element($window).bind('resize', function() {
          checkSize();
        });
      }
    };
  }])
;
