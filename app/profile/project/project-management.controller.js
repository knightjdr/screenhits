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
