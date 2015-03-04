var appControllers = angular.module('Controllers', []);


app.controller('storeListCtrl', ['$http', '$scope', 'Phone', '$q',
	function ($http, $scope, Phone, $q) {

		$scope.stores = [];

		$scope.shoes = [];

		$scope.userPhoto = '';
		$scope.userName = '';
		$scope.userEmail = '';

		$http.get('stores.json').success(function (data) {
			$scope.stores = data;
		});

		Phone.init();

		$scope.userLogin = function () {
			//Phone.getShoes();
			var promise = Phone.fbLogin();
			promise.then(function (user) {
				if (user.infoSet == false) {
					var userPromise = Phone.getUserData();
					userPromise.then(function (userData) {
						var picturePromise = Phone.getUserPicture();
						picturePromise.then(function (picture) {
							userData.picture = picture.picture;
							Phone.setUserData(userData);
						}, function (failure) {

						});
					}, function (failure) {
						console.log(failure);
					});
				}
				console.log(user);
			}, function (failure) {
				console.log(failure);
			});
		}

		$scope.getUserInfo = function () {

			var promise = Phone.getUserData();
			promise.then(function (success) {
				console.log(success);
				//	$scope.userPhoto = success.picture;
				$scope.userName = success.name;
				$scope.userEmail = success.email;
			}, function (failure) {
				console.log(failure);
			});
		}

		$scope.updateUserProfile = function () {
			var user = {};
			user.website = "abcd.com";
			user.description = "Lorem ipsum";
			user.username = "New User";
			user.email = "newemail@new.com";

			var availability = Phone.checkUsernameAvailablility(user.username);

			availability.then(function (success) {
				if (!success) {
					alert("Username taken");
				} else {
					alert("Available");

					var promise = Phone.setUserDataParse(user);

					promise.then(function (success) {
						alert("Data Updated");
					}, function (failure) {
						alert("Failed to Update Data");
					});

				}
			}, function (failure) {
				console.log(failure);
			});

		}

		$scope.increaseUpvote = function (id) {

			angular.forEach($scope.stores, function (store) {
				if (store.id == id)
					store.upvote++;
			});

		}

	}
]);

app.controller('storeCtrl', ['$http', '$scope', '$routeParams',
	function ($http, $scope, $routeParams) {

		$scope.storeName = '';
		$scope.address = '';
		$scope.upvote = 0;
		$scope.stores = [];
		console.log($routeParams);
		$http.get('stores.json').success(function (data) {
			$scope.stores = data;
			angular.forEach($scope.stores, function (store) {
				if (store.id == $routeParams.id) {
					$scope.storeName = store.name;
					$scope.address = store.address;
					$scope.upvote = store.upvote;
				}
			});
		});

	}
]);


app.controller('collectionsCtrl', ['$http', '$scope', '$routeParams',
	function ($http, $scope, $routeParams) {
		$scope.cid = 0;
		$scope.collections = [];
		console.log($routeParams);
		$http.get('stores.json').success(function (data) {
			$scope.collections.push({
				"name": "1",
				"stores": data.slice(0, 5)
			});
			$scope.collections.push({
				"name": "2",
				"stores": data.slice(0, 5)
			});
			$scope.collections.push({
				"name": "3",
				"stores": data.slice(0, 5)
			});
			$scope.collections.push({
				"name": "4",
				"stores": data.slice(0, 5)
			});
			console.log($scope.collections);
		});


	}
]);