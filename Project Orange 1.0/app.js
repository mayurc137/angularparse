var app = angular.module('oragne', ['ngRoute', 'services']);

app.config(['$routeProvider',
	function($routeProvider) {
	
		$routeProvider.
		when('/:storeHandle', {
			templateUrl: 'partials/store.html',
			controller: 'storeController'
			controllerAs: 'store'
		});
		
}]);

