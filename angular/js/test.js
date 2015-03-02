var demoApp = angular.module('demoApp',[])
.factory('simpleFactory', function(){
	var factory = {};
	var customers = "Orange";
	factory.getValue = function(){
		return customers;
	}
	return factory;
})
.controller('Simple', function($scope,simpleFactory){
	$scope.customers = simpleFactory.getValue();
});