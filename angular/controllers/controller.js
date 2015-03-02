
var appControllers = angular.module('Controllers', []);


app.controller('storeListCtrl', ['$http', '$scope', 'Phone', '$q', function($http, $scope, Phone, $q){
	
	$scope.stores = [];
		
	$scope.shoes = [];

	$scope.userPhoto = '';
	$scope.userName = '';
	$scope.userEmail = '';

	$http.get('stores.json').success(function(data){
		$scope.stores = data;
	});

	Phone.init();

	$scope.getParseData = function(){
		//Phone.getShoes();
		Phone.fbLogin();
	}

	$scope.getUserInfo = function(){

		var promise = Phone.getUserData();
		promise.then(function(success){
			console.log(success);
			$scope.userPhoto = success.picture;
			$scope.userName = success.name;
			$scope.userEmail = success.email;
		}, function(failure){
			console.log(failure);
		});
	}

	$scope.increaseUpvote = function(id){

		angular.forEach($scope.stores, function(store){
			if(store.id == id)
				store.upvote++;
		});
				
	}

}]);

app.controller('storeCtrl', ['$http', '$scope', '$routeParams', 
	function($http, $scope, $routeParams){

		$scope.storeName = '';
		$scope.address = '';
		$scope.upvote = 0;
		$scope.stores = [];
		console.log($routeParams);
		$http.get('stores.json').success(function(data){
			$scope.stores = data;
			angular.forEach($scope.stores, function(store){
				if(store.id == $routeParams.id){
					$scope.storeName = store.name;
					$scope.address = store.address;
					$scope.upvote = store.upvote;
				}
			});
		});

	}]);


app.controller('collectionsCtrl', ['$http', '$scope', '$routeParams', 
	function($http, $scope, $routeParams){
		$scope.cid = 0;
		$scope.collections = [];
		console.log($routeParams);
		$http.get('stores.json').success(function(data){
			$scope.collections.push({"name":"1","stores":data.slice(0,5)});
			$scope.collections.push({"name":"2","stores":data.slice(0,5)});
			$scope.collections.push({"name":"3","stores":data.slice(0,5)});
			$scope.collections.push({"name":"4","stores":data.slice(0,5)});
			console.log($scope.collections);
		});


}]);