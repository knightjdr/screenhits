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
