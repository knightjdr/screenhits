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
