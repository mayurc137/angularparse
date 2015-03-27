var app = angular.module('Controllers', []);

app.controller('storeController', ['storeData', '$scope', '$routeParams', function(storeData, $scope, $routeParams){
	
	//Get Store Data from the service
	$scope.store = storeData.getStoreData();

	$scope.storeHandle = $routeParams.storeHandle;
	//if storeData not available fetch from parse
	if($scope.store == null){
		//Fetch From Parse
		storeData.getStoreDataByHandle().then(function(store){
			$scope.store = store;
		}, function(message){
			console.log(message);
		});
	}



}]);