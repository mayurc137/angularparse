var appControllers = angular.module('dataEntryControllers', []);

appControllers.controller('formCtrl', ['$q', '$scope', 'ParseFactory', '$rootScope', '$routeParams', '$route', '$location',
	function ($q, $scope, ParseFactory, $rootScope, $routeParams, $route, $location) {

		if (!sessionStorage.getItem('loggedIn')) {
			$location.path('login');
		}

		ParseFactory.init();

		$rootScope.seo = {};
		$rootScope.seo.pageTitle = "Store Info";
		$rootScope.seo.description = "Description of the page";
		$rootScope.seo.keywords = "keyword1,keyword2";

		$scope.formAction = $routeParams.action;

		$scope.storeData = null;
		$scope.ownerData = null;
		$scope.store = {};
		$scope.store.storeHandle = "";
		$scope.store.storeID = "",
		$scope.store.name = "",
		$scope.store.address = "",
		$scope.store.description = "",
		$scope.store.email = "",
		$scope.store.primaryPhone = "",
		$scope.store.secPhone = "",
		$scope.store.website = "",
		$scope.store.twitterLink = "",
		$scope.store.facebook_link = "",
		$scope.store.majorSale = "",
		$scope.store.startTime = null,
		$scope.store.endTime = null,
		$scope.store.onlineStore = "",
		$scope.store.latitude = "",
		$scope.store.logoImage = null,
		$scope.store.bannerImage = null,
		$scope.store.longitude = "",
		$scope.store.selectedTags = [],
		$scope.store.workingDays = [],
		$scope.store.selectedPayment = "Cash",
		$scope.store.selectedCategory = null,
		$scope.store.locality = null;

		$scope.availabilityChecked = false;
		$scope.storeHandleAvailable = true;

		$scope.bannerImageChanged = false;
		$scope.logoImageChanged = false;

		$scope.storeData = {};
		$scope.localities = [];
		$scope.dupLocalities = [];
		$scope.states = [];
		$scope.cities = [];
		$scope.categories = [];
		$scope.tags = [];
		$scope.tagNames = [];
		$scope.selectedState = null;
		$scope.selectedCity = null;
		$scope.selectedLocality = 0;

		$scope.logo = "";
		$scope.logoSrc = "";

		$scope.banner = "";
		$scope.bannerSrc = "";

		$scope.adminPresent = false;
		$scope.managerPresent = false;
		$scope.newAdminPresent = false;
		$scope.adminBtnText = "Add Admin";
		$scope.managerBtnText = "Add Manager";
		$scope.ownerEmailAvailable = true;
		$scope.adminEmailAvailable = true;

		$scope.administrators = [];

		$scope.admin = {};
		$scope.admin.name = "",
		$scope.admin.email = "",
		$scope.admin.phone = "";

		$scope.storeOwner = {};
		$scope.storeOwner.name = "",
		$scope.storeOwner.email = "",
		$scope.storeOwner.phone = "";

		$scope.selectedAdmin = -1;

		$scope.weekDays = [{
			name: "Sunday",
			selected: false
		}, {
			name: "Monday",
			selected: false
		}, {
			name: "Tuesday",
			selected: false
		}, {
			name: "Wednesday",
			selected: false
		}, {
			name: "Thursday",
			selected: false
		}, {
			name: "Friday",
			selected: false
		}, {
			name: "Saturday",
			selected: false
		}];

		$scope.acceptedTypes = {
			'image/png': true,
			'image/jpeg': true,
			'image/gif': true
		};

		$scope.paymentOptions = ["Cash", "Cash and Card"];

		ParseFactory.getLocality().then(
			function (localities) {
				$scope.localities = localities;
				$scope.getUniqueCities();
			}, function (error) {
				console.log(error);
			}
		);

		ParseFactory.getCategories().then(
			function (categories) {
				$scope.categories = categories;
				$scope.store.selectedCategory = categories[0];
			}, function (message) {
				console.log(message);
			}
		);

		ParseFactory.getTags().then(
			function (tags) {
				$scope.tags = tags;
				$scope.assignTagsCategories();

			}, function (message) {
				console.log(message);
			}
		);

		ParseFactory.fetchAllAdmins().then(
			function (admins) {
				$scope.administrators = admins;
				if ($scope.administrators.length == 0) {
					$scope.newAdmin();
				}
				console.log($scope.administrators);
			}, function (message) {
				console.log(message);
			}
		);

		$scope.storeLogoChanged = function (files) {
			console.log(files);
			$scope.store.logoImage = files[0];
			$scope.logoImageChanged = true;

			if ($scope.acceptedTypes[$scope.store.logoImage.type] !== true) {
				alert("Invalid File Type For Logo Image");
				$scope.store.logoImage = null;
				$scope.logoImageChanged = false;
			} else {

				var reader = new FileReader();
				reader.onload = function (event) {
					$scope.logoSrc = event.target.result;
				};

				reader.readAsDataURL($scope.store.logoImage);
			}

			console.log($scope.store.logoImage);
		}

		$scope.updateLogoDisplay = function () {
			$scope.logo = $scope.logoSrc;
		}

		$scope.storeBannerChanged = function (files) {
			console.log(files);
			$scope.store.bannerImage = files[0];
			$scope.bannerImageChanged = true;
			if ($scope.acceptedTypes[$scope.store.bannerImage.type] !== true) {
				alert("Invalid File Type For Banner Image");
				$scope.store.bannerImage = null;
				$scope.bannerImageChanged = false;
			} else {
				var reader = new FileReader();
				reader.onload = function (event) {
					$scope.bannerSrc = event.target.result;
				};
				reader.readAsDataURL($scope.store.bannerImage);
			}
		}

		$scope.updateBannerDisplay = function () {
			$scope.banner = $scope.bannerSrc;
		}


		$scope.toggleAdminActive = function () {
			if ($scope.adminPresent) {
				$scope.adminPresent = false;
				$scope.adminBtnText = "Add Admin";
				$scope.newAdminPresent = false;
				$scope.admin = {};
			} else {
				$scope.adminPresent = true;
				$scope.adminBtnText = "No Admin";
			}
		}

		$scope.toggleManagerActive = function () {
			if ($scope.managerPresent) {
				$scope.managerPresent = false;
				$scope.managerBtnText = "Add Manager";
				$scope.storeOwner = {};
			} else {
				$scope.managerPresent = true;
				$scope.managerBtnText = "No Manager";
			}
		}

		$scope.newAdmin = function () {
			$scope.newAdminPresent = true;
			$scope.admin = {};
		}

		$scope.adminChange = function () {

			$scope.admin = $scope.administrators[$scope.selectedAdmin];

			if ($scope.admin) {
				$scope.admin.name = $scope.admin.get('name');
				$scope.admin.email = $scope.admin.get('email');
				$scope.admin.phone = $scope.admin.get('phone');
			}
		}

		$scope.getStoreDetails = function () {

			$scope.store.storeHandle = $scope.store.storeHandle.toLowerCase();

			if ($scope.store.storeHandle != "") {
				ParseFactory.getStoreByHandle($scope.store.storeHandle).then(
					function (storeObject) {

						if (storeObject) {

							$scope.storeData = storeObject;
							$scope.getStoreAdmin();
							//$scope.getStoreManager();
							$scope.setStoreDetails();

						} else {
							alert("Store Does Not Exist");
						}

					}, function (error) {
						console.log(error);
					}
				);
			}

		}

		$scope.getStoreAdmin = function () {
			ParseFactory.getStoreAdmin($scope.storeData).then(
				function (admin) {
					console.log(admin);
				}, function (message) {
					console.log(message);
				}
			);
		}

		$scope.getStoreManager = function () {
			ParseFactory.getStoreManager($scope.storeData).then(
				function (manager) {
					console.log(manager);
				}, function (message) {
					console.log(message);
				}
			);
		}

		$scope.setStoreDetails = function () {
			$scope.store.storeHandle = $scope.storeData.get('store_handle');
			$scope.store.storeID = $scope.storeData.id;
			$scope.store.name = $scope.storeData.get('name');
			$scope.store.address = $scope.storeData.get('address');
			$scope.store.description = $scope.storeData.get('description');
			$scope.store.email = $scope.storeData.get('email');

			var phoneNumbers = $scope.storeData.get('phone');
			if (phoneNumbers) {
				if (phoneNumbers.length > 0)
					$scope.store.primaryPhone = phoneNumbers[0];
				if (phoneNumbers.length == 2)
					$scope.store.secPhone = phoneNumbers[1];
			}

			$scope.store.website = $scope.storeData.get('website_link');
			$scope.store.twitterLink = $scope.storeData.get('twitter_link');
			$scope.store.facebook_link = $scope.storeData.get('facebook_link');
			$scope.store.majorSale = $scope.storeData.get('major_sale');
			$scope.store.startTime = $scope.storeData.get('start_time');
			$scope.store.endTime = $scope.storeData.get('end_time');
			$scope.store.onlineStore = $scope.storeData.get('online_store_link');

			var geoLocation = $scope.storeData.get('geolocation');

			$scope.store.latitude = geoLocation.latitude;
			$scope.store.longitude = geoLocation.longitude;
			$scope.store.logoImage = $scope.storeData.get('logo');
			console.log($scope.store.logoImage);
			$scope.store.bannerImage = $scope.storeData.get('banner_image');

			$scope.store.selectedTags = $scope.storeData.get('tags');
			$scope.store.workingDays = $scope.storeData.get('working_days');
			var paymentType = $scope.storeData.get('payment_type');
			if (paymentType && paymentType.length > 0)
				$scope.store.selectedPayment = paymentType[0];
			$scope.store.selectedCategory = $scope.storeData.get('primary_category');
			$scope.store.locality = $scope.storeData.get('locality');

			console.log($scope.store);

			$scope.setLocality();
			$scope.setWorkingDays();
			$scope.setActiveTags();
		}

		$scope.setLocality = function () {
			$scope.selectedState = $scope.store.locality.get('state');
			$scope.selectedCity = $scope.store.locality.get('city');
			$scope.cityChange();
		}

		$scope.setWorkingDays = function () {
			var length = $scope.store.workingDays;
			for (var i = 0; i < $scope.weekDays.length; i++) {

				var index = $scope.store.workingDays.indexOf($scope.weekDays[i].name);

				if (index != -1)
					$scope.weekDays[i].selected = true;
			}
		}

		$scope.setActiveTags = function () {
			for (var i = 0; i < $scope.store.selectedTags.length; i++) {
				var index = $scope.tagNames.indexOf($scope.store.selectedTags[i].get('tag_description'));
				$scope.tags[index].selected = true;
			}

		}

		$scope.getUniqueCities = function () {

			var city = {};
			var lastReadState = $scope.localities[0].get("state");
			var lastReadCity = $scope.localities[0].get("city");

			var tempCities = [];

			$scope.states.push(lastReadState);
			city.name = $scope.localities[0].get("city");
			city.state = lastReadState;
			$scope.cities.push(city);

			tempCities.push($scope.localities[0].get("city"));

			$scope.selectedState = city.state;
			$scope.selectedCity = city.name;

			for (var i = 1; i < $scope.localities.length; i++) {

				if ($scope.states.indexOf($scope.localities[i].get('state')) == -1) {
					$scope.states.push($scope.localities[i].get('state'));
				}

				if (tempCities.indexOf($scope.localities[i].get('city')) == -1) {
					var city = {};
					city.name = $scope.localities[i].get('city');
					city.state = $scope.localities[i].get('state');
					$scope.cities.push(city);
					tempCities.push($scope.localities[i].get("city"));
				}
			}

			console.log($scope.states);
			console.log($scope.cities);

			$scope.cityChange();
		}

		$scope.cityChange = function () {

			$scope.dupLocalities = [];
			$scope.selectedLocality = 0;
			var j = 0;
			var index = -1;
			for (var i = 0; i < $scope.localities.length; i++) {
				if ($scope.localities[i].get('city') == $scope.selectedCity) {
					$scope.dupLocalities.push($scope.localities[i]);

					if ($scope.store.locality) {
						if ($scope.store.locality.id == $scope.localities[i].id) {
							index = j;
						}
					}
					j++;
				}
			}

			if (index != -1) {
				var temp = $scope.dupLocalities[index];
				$scope.dupLocalities[index] = $scope.dupLocalities[0];
				$scope.dupLocalities[0] = temp;
			}

			console.log($scope.selectedLocality);

		}

		$scope.assignTagsCategories = function () {

			for (var i = 0; i < $scope.tags.length; i++) {
				$scope.tags[i].category = $scope.tags[i].get('tag_category').get('categoryName');
				$scope.tags[i].selected = false;
				$scope.tags[i].name = $scope.tags[i].get('tag_description');
				$scope.tagNames.push($scope.tags[i].get('tag_description'));
			}

			console.log($scope.tags);
		}

		$scope.setSelectedCategory = function (category) {
			$scope.store.selectedCategory = category;
		}

		$scope.toggleTag = function (tag) {

			//Check that the number of tags is less than the limit;

			if (tag.selected) {
				//Remove From List of Selected
				tag.selected = false;
				for (var i = 0; i < $scope.store.selectedTags.length; i++) {
					if (tag.id == $scope.store.selectedTags[i].id) {
						$scope.store.selectedTags.splice(i, 1);
						break;
					}
				}

				console.log($scope.store.selectedTags);

			} else {
				//Add to list of selected
				tag.selected = true;
				$scope.store.selectedTags.push(tag);

				console.log($scope.store.selectedTags);
			}
		}

		$scope.toggleDay = function (day) {
			if (day.selected) {
				day.selected = false;
				var index = $scope.store.workingDays.indexOf(day.name);
				$scope.store.workingDays.splice(index, 1);
			} else {
				day.selected = true;
				$scope.store.workingDays.push(day.name);
			}

			console.log($scope.store.workingDays);
		}

		$scope.checkStoreHandleAvailability = function () {

			$scope.store.storeHandle = $scope.store.storeHandle.toLowerCase();

			var deferred = $q.defer();

			$scope.availabilityChecked = true;

			ParseFactory.checkStoreHandleAvailablility($scope.store.storeHandle).then(
				function (result) {

					if (result == null) {
						$scope.storeHandleAvailable = true;
						console.log("available");
						deferred.resolve(true);
					} else {
						if ($scope.formAction == "create") {
							//StoreHandle is not available
							$scope.storeHandleAvailable = false;
							console.log("unavailable");
							alert("Store Handle unavailable");
							deferred.reject("Store Handle unavailable");
						} else {
							if ($scope.store.storeID == result.id) {
								//Current Store has been fetched hence allow it
								$scope.storeHandleAvailable = true;
								console.log("available");
								deferred.resolve(true);
							} else {
								//Another Store has the same handle
								$scope.storeHandleAvailable = false;
								console.log("unavailable");
								alert("Store Handle unavailable");
								deferred.reject("Store Handle unavailable");
							}
						}
					}

				}, function (message) {
					console.log(message);
					alert("Unable to connect. Try Again in sometime");
					deferred.reject(message);
				}
			);

			return deferred.promise;
		}

		$scope.checkAdminEmailUnique = function () {
			var deferred = $q.defer();

			ParseFactory.checkEmailAvailablility($scope.admin.email).then(
				function (result) {

					if (result == null) {
						$scope.adminEmailAvailable = true;
						console.log("available");
						deferred.resolve(true);
					} else {

						if ($scope.newAdminPresent) {
							$scope.adminEmailAvailable = false;
							console.log("unavailable");
							alert("Admin with Given email Already Exists");
							deferred.reject("Email associated with another account");
						} else {
							if ($scope.admin.id == result.id) {
								$scope.adminEmailAvailable = true;
								console.log("available");
								deferred.resolve(true);
							} else {
								$scope.adminEmailAvailable = false;
								console.log("unavailable");
								alert("Admin with Given email Already Exists");
								deferred.reject("Email associated with another account");
							}
						}
					}

				}, function (message) {
					console.log(message);
					deferred.reject(message);
				}
			);
			return deferred.promise;
		}

		$scope.checkManagerEmailUnique = function () {
			var deferred = $q.defer();

			ParseFactory.checkEmailAvailablility($scope.storeOwner.email).then(
				function (result) {

					if (result == null) {
						$scope.ownerEmailAvailable = true;
						console.log("available");
						deferred.resolve(true);
					} else {
						if ($scope.formAction == "create") {
							$scope.ownerEmailAvailable = false;
							console.log("unavailable");
							alert("Manager Email associated with another account");
							deferred.reject("Email associated with another account");
						} else {

							if (result.get('is_admin') == true) {
								$scope.ownerEmailAvailable = false;
								console.log("unavailable");
								alert("Manager Email associated with another account");
								deferred.reject("Email associated with another account");
							}

							if (result.get('store_ids').length == 1 && result.get('store_ids')[0].id == $scope.store.storeID) {
								//Current Store has been fetched hence allow it
								$scope.ownerEmailAvailable = true;
								console.log("available");
								deferred.resolve(true);
							} else {
								//Another Store has the same handle
								$scope.ownerEmailAvailable = false;
								console.log("unavailable");
								alert("Manager Email associated with another account");
								deferred.reject("Email associated with another account");
							}

						}
					}

				}, function (message) {
					console.log(message);
					deferred.reject(message);
				}
			);
			return deferred.promise;
		}

		$scope.checkParameters = function () {
			var deferred = $q.defer();

			$scope.checkStoreHandleAvailability().then(
				function (result) {

					if ($scope.adminPresent && $scope.managerPresent) {

						if ($scope.admin.email == $scope.storeOwner.email) {
							alert("Admin and Manager email cannot be the same");
							deferred.reject(false);
						}

						$scope.checkAdminEmailUnique().then(
							function (result) {
								$scope.checkManagerEmailUnique().then(
									function (success) {
										deferred.resolve(true);
									}, function (message) {
										deferred.reject(false);
									}
								);

							}, function (message) {
								deferred.reject(false);
							}
						);
					} else if ($scope.adminPresent) {
						$scope.checkAdminEmailUnique().then(
							function (result) {
								deferred.resolve(true);
							}, function (message) {
								deferred.reject(false);
							}
						);
					} else {
						$scope.checkManagerEmailUnique().then(
							function (success) {
								deferred.resolve(true);
							}, function (message) {
								deferred.reject(false);
							}
						);
					}

				}, function (message) {
					deferred.reject(false);
				}
			);

			return deferred.promise;
		}

		$scope.createStore = function () {
			//Creating New Store
			ParseFactory.createStore($scope.store).then(
				function (store) {
					console.log("Store Created");
					console.log(store);

					$scope.storeOwner.store_id = store.id;
					$scope.admin.store_id = store.id;
					$scope.admin.storeHandle = store.get('store_handle');
					$scope.storeOwner.storeHandle = store.get('store_handle');

					if ($scope.adminPresent && $scope.managerPresent) {
						$scope.createAdmin().then(
							function (admin) {
								$scope.createManager().then(
									function (manager) {
										console.log("Successfully Registered Store");
										alert("Successfully Registered Store");
										$route.reload();
									}, function (message) {
										console.log(message);
										alert("Error Creating User.\nContact System Admin");
									}
								);

							}, function (message) {
								console.log(message);
								alert("Error Creating User.\nContact System Admin");
							}
						);
					} else if ($scope.adminPresent) {
						$scope.createAdmin().then(
							function (admin) {
								console.log("Successfully Registered Store");
								alert("Successfully Registered Store");
								$route.reload();
							}, function (message) {
								console.log(message);
								alert("Error Creating User.\nContact System Admin");
							}
						);
					} else {
						$scope.createManager().then(
							function (manager) {
								console.log("Successfully Registered Store");
								alert("Successfully Registered Store");
								$route.reload();
							}, function (message) {
								console.log(message);
								alert("Error Creating User.\nContact System Admin");
							}
						);
					}

				}, function (message) {
					alert(message);
				}
			);
		}

		$scope.createAdmin = function () {
			var deferred = $q.defer();

			if ($scope.newAdminPresent) {

				$scope.admin.username = $scope.admin.storeHandle + "admin";

				ParseFactory.storeRegAdmin($scope.admin).then(
					function (admin) {
						console.log(admin);
						deferred.resolve(admin);
					}, function (error) {
						console.log(error);
						deferred.reject(error);
					}
				);
			} else {

				var adminObject = {};
				adminObject.name = $scope.admin.name;
				adminObject.phone = $scope.admin.phone;
				adminObject.email = $scope.admin.email;
				adminObject.store_id = $scope.admin.store_id;
				adminObject.id = $scope.admin.id;

				ParseFactory.editStoreAdmin(adminObject, adminObject).then(
					function (admin) {
						console.log(admin);
						deferred.resolve(admin);
					}, function (error) {
						console.log(error);
						deferred.reject(error);
					}
				);
			}

			return deferred.promise;
		}

		$scope.createManager = function () {
			var deferred = $q.defer();

			$scope.storeOwner.username = $scope.storeOwner.storeHandle;

			ParseFactory.storeRegManager($scope.storeOwner).then(
				function (manager) {
					console.log(manager);
					deferred.resolve(manager);
				}, function (error) {
					console.log(error);
					deferred.reject(error);
				}
			);

			return deferred.promise;
		}

		$scope.editStore = function () {
			if ($scope.storeData == null) {
				alert("Specified Store Does Not Exist. Contact System Admin");
			} else {
				ParseFactory.addDetailsToStore($scope.storeData, $scope.store,
					$scope.logoImageChanged, $scope.bannerImageChanged).then(
					function (storeObject) {
						console.log(storeObject);
						ParseFactory.editStoreOwner($scope.ownerData, $scope.storeOwner).then(
							function (user) {
								console.log(user);
								alert("Successfully Edited Store");
								$route.reload();
							}, function (message) {
								console.log(message);
							}
						);
					}, function (message) {
						console.log(message);
					}
				);
			}
		}

		$scope.saveStore = function () {

			console.log($scope.store);
			console.log($scope.storeOwner);
			console.log($scope.admin);

			//Check if manager and admin email are the same

			$scope.store.locality = $scope.dupLocalities[$scope.selectedLocality];

			$scope.store.storeHandle = $scope.store.storeHandle.toLowerCase();

			if ($scope.adminPresent || $scope.managerPresent) {
				$scope.checkParameters().then(
					function (success) {
						if ($scope.formAction == "edit") {
							$scope.editStore();
						} else {
							$scope.createStore();
						}
					}, function (message) {
						console.log("Parameters are wrong");
					}
				);

			} else {
				alert("You must add an Administrator or a Manager");
			}

		}

	}
]);


appControllers.controller('galleryCtrl', ['$q', '$scope', 'ParseFactory', '$rootScope', '$route', '$location',
	function ($q, $scope, ParseFactory, $rootScope, $route, $location) {

		if (!sessionStorage.getItem('loggedIn')) {
			$location.path('login');
		}

		ParseFactory.init();

		$rootScope.seo = {};
		$rootScope.seo.pageTitle = "Store Gallery";
		$rootScope.seo.description = "Gallery of the page";
		$rootScope.seo.keywords = "keyword1,keyword2";

		$scope.storeHandle = "";
		$scope.store = {};
		$scope.gallery = [];
		$scope.invalidStore = false;
		$scope.imageCount = 0;
		$scope.files = [];

		$scope.multiselect = false;
		$scope.selectAll = false;
		$scope.imagesToDelete = [];

		$scope.acceptedTypes = {
			'image/png': true,
			'image/jpeg': true,
			'image/gif': true
		};

		$scope.uploadImages = function (files) {

			for (var i = 0; i < files.length; i++) {
				$scope.files.push(files[i]);
				$scope.imageCount++;
			}

			$scope.$apply();

		}

		$scope.getStoreDetails = function () {

			if ($scope.storeHandle != "") {
				ParseFactory.getStoreByHandle($scope.storeHandle).then(
					function (storeObject) {

						if (storeObject) {
							$scope.store = storeObject;
							$scope.invalidStore = false;
							console.log($scope.store);
							$scope.getGalleryImages();
						} else {
							$scope.invalidStore = true;
						}

					}, function (error) {
						$scope.invalidStore = true;
						console.log(error);
					}
				);
			} else {
				$scope.invalidStore = true;
				alert("Store Does Not Exist");
			}
		}

		$scope.getGalleryImages = function () {
			ParseFactory.fetchGalleryOfStore($scope.store).then(
				function (gallery) {
					console.log(gallery);
					$scope.gallery = gallery;
				}, function (message) {
					console.log(message);
				}
			);
		}

		$scope.clearSelection = function () {
			$scope.files = [];
			$scope.imageCount = 0;
		}

		$scope.uploadToGallery = function () {

			if ($scope.store != null) {
				angular.forEach($scope.files, function (file) {

					ParseFactory.addStoreImageToGallery($scope.store, file).then(
						function (picture) {
							$scope.imageCount--;
							$scope.gallery.push(picture);

						}, function (message) {
							console.log(message);
						}
					);

				});

				$scope.files = [];

			} else {
				alert("Store must be selected first");
			}
		}

		$scope.toggleMultiSelect = function () {
			$scope.selectAll = false;

			if ($scope.multiselect == true) {
				$scope.multiselect = false;
			} else {
				$scope.multiselect = true;
			}
		}

		$scope.toggleImageSelect = function (position) {

			console.log(position);

			var index = $scope.imagesToDelete.indexOf(position);

			if (index == -1) {
				$scope.imagesToDelete.push(position);
				$scope.gallery[position].selected = true;
			} else {
				$scope.imagesToDelete.splice(index, 1);
				$scope.gallery[position].selected = false;
			}
		}

		$scope.deletePictures = function () {
			$scope.imagesToDelete.sort(function (a, b) {
				return b - a
			});

			for (var i = 0; i < $scope.imagesToDelete.length; i++) {

				var index = $scope.imagesToDelete[i];

				ParseFactory.removeStoreImageFromGallery($scope.store,
					$scope.gallery[index]).then(
					function (success) {
						$scope.gallery.splice(index, 1);
					}, function (message) {
						console.log(message);
					}
				);
			}

			console.log($scope.imagesToDelete);
			$scope.imagesToDelete = [];

		}

		$scope.toggleAllPictures = function () {
			$scope.multiselect = false;

			if ($scope.selectAll == true) {

				$scope.selectAll = false;
				$scope.imagesToDelete = [];
				for (var i = 0; i < $scope.gallery.length; i++) {
					$scope.gallery[i].selected = false;
				}

			} else {
				$scope.selectAll = true;
				$scope.imagesToDelete = [];
				for (var i = 0; i < $scope.gallery.length; i++) {
					$scope.gallery[i].selected = true;
					$scope.imagesToDelete.push(i);
				}
			}
		}



	}

]);


appControllers.controller('loginCtrl', ['$scope', 'ParseFactory', '$rootScope',
	function ($scope, ParseFactory, $rootScope) {

		ParseFactory.init();

		$rootScope.seo = {};
		$rootScope.seo.pageTitle = "Store Info";
		$rootScope.seo.description = "Description of the page";
		$rootScope.seo.keywords = "keyword1,keyword2";

		$scope.user = {};
		$scope.user.username = "";
		$scope.user.password = "";

		$scope.invalidInput = false;
		$scope.popupVisible = false;

		$scope.DataEntryLogin = function () {
			console.log($scope.user);
			ParseFactory.dataCollectorLogin($scope.user.username, $scope.user.password).then(
				function (success) {
					//console.log(success);
					if (success == false) {
						console.log("Error User Not Present");
						$scope.invalidInput = true;
					} else if (success == true) {
						console.log("Logged In");
						$scope.invalidInput = false;
						$scope.popupVisible = true;
						sessionStorage.setItem("username", $scope.user.username);
						sessionStorage.setItem("loggedIn", true);
					}
				}, function (message) {
					console.log(message);
					$scope.invalidInput = true;
				}
			);
		}

	}
]);