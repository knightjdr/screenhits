(function() {
	'use strict';

	angular.module('app')
    .service('projects', ['$rootScope', function($rootScope) {
      var projects = [];
      this.add = function(data) {
				projects.push(data);
				$rootScope.$broadcast('projects:updated', projects);
			};
			this.get = function() {
				return projects;
			};
      this.set = function(data) {
        projects = JSON.parse(JSON.stringify(data));
        $rootScope.$broadcast('projects:updated', projects);
      };
			this.update = function(project, key, data) {
				var index = projects.map(function(o) { return o._id; }).indexOf(project);
        projects[index][key] = data;
        $rootScope.$broadcast('projects:updated', projects);
      };
		}])
  ;
})();
