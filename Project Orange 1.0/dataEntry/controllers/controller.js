var appControllers = angular.module('dataEntryControllers', []);

appControllers.controller('formCtrl', ['$q', '$scope', 'ParseFactory', '$rootScope', '$routeParams', '$route',
    function($q, $scope, ParseFactory, $routeScope, $routeParams, $route) {

        ParseFactory.init();

        $routeScope.pageTitle = "Store Info";

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
        $scope.ownerEmailAvailable = true;

        $scope.storeOwner = {};
        $scope.storeOwner.name = "",
        $scope.storeOwner.email = "",
        $scope.storeOwner.phone = "";

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
            function(localities) {
                $scope.localities = localities;
                $scope.getUniqueCities();
            }, function(error) {
                console.log(error);
            }
        );

        ParseFactory.getCategories().then(
            function(categories) {
                $scope.categories = categories;
                $scope.store.selectedCategory = categories[0];
            }, function(message) {
                console.log(message);
            }
        );

        ParseFactory.getTags().then(
            function(tags) {
                $scope.tags = tags;
                $scope.assignTagsCategories();

            }, function(message) {
                console.log(message);
            }
        );

        $scope.storeLogoChanged = function(files) {
            console.log(files);
            $scope.store.logoImage = files[0];
            $scope.logoImageChanged = true;

            if ($scope.acceptedTypes[$scope.store.logoImage.type] !== true) {
                alert("Invalid File Type For Logo Image");
                $scope.store.logoImage = null;
                $scope.logoImageChanged = false;
            } else {

                var reader = new FileReader();
                reader.onload = function(event) {
                    $scope.logoSrc = event.target.result;
                };

                reader.readAsDataURL($scope.store.logoImage);
            }

            console.log($scope.store.logoImage);
        }

        $scope.updateLogoDisplay = function() {
            $scope.logo = $scope.logoSrc;
        }

        $scope.storeBannerChanged = function(files) {
            console.log(files);
            $scope.store.bannerImage = files[0];
            $scope.bannerImageChanged = true;
            if ($scope.acceptedTypes[$scope.store.bannerImage.type] !== true) {
                alert("Invalid File Type For Banner Image");
                $scope.store.bannerImage = null;
                $scope.bannerImageChanged = false;
            } else {
                var reader = new FileReader();
                reader.onload = function(event) {
                    $scope.bannerSrc = event.target.result;
                };
                reader.readAsDataURL($scope.store.bannerImage);
            }
        }

        $scope.updateBannerDisplay = function() {
            $scope.banner = $scope.bannerSrc;
        }

        $scope.getStoreDetails = function() {

            $scope.store.storeHandle = $scope.store.storeHandle.toLowerCase();

            if ($scope.store.storeHandle != "") {
                ParseFactory.getStoreByHandle($scope.store.storeHandle).then(
                    function(storeObject) {

                        if (storeObject) {

                            $scope.storeData = storeObject;
                            ParseFactory.getStoreOwner($scope.storeData).then(
                                function(ownerObject) {
                                    console.log(ownerObject);
                                    if (ownerObject) {
                                        $scope.ownerData = ownerObject;
                                        $scope.setStoreDetails();
                                    } else {
                                        alert("No Store Owner Details! Contact Admin");
                                    }

                                }, function(message) {
                                    console.log(message)
                                }
                            );
                        } else {
                            alert("Store Does Not Exist");
                        }

                    }, function(error) {
                        console.log(error);
                    }
                );
            }

        }

        $scope.setStoreDetails = function() {
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

            $scope.storeOwner.name = $scope.ownerData.get('name');
            $scope.storeOwner.email = $scope.ownerData.get('email');
            $scope.storeOwner.phone = $scope.ownerData.get('phone');

            console.log($scope.store);
            console.log($scope.storeOwner);

            $scope.setLocality();
            $scope.setWorkingDays();
            $scope.setActiveTags();
        }

        $scope.setLocality = function() {
            $scope.selectedState = $scope.store.locality.get('state');
            $scope.selectedCity = $scope.store.locality.get('city');
            $scope.cityChange();
        }

        $scope.setWorkingDays = function() {
            var length = $scope.store.workingDays;
            for (var i = 0; i < $scope.weekDays.length; i++) {

                var index = $scope.store.workingDays.indexOf($scope.weekDays[i].name);

                if (index != -1)
                    $scope.weekDays[i].selected = true;
            }
        }

        $scope.setActiveTags = function() {
            for (var i = 0; i < $scope.store.selectedTags.length; i++) {
                var index = $scope.tagNames.indexOf($scope.store.selectedTags[i].get('tag_description'));
                $scope.tags[index].selected = true;
            }

        }

        $scope.getUniqueCities = function() {

            var city = {};
            var lastReadState = $scope.localities[0].get("state");
            var lastReadCity = $scope.localities[0].get("city");

            $scope.states.push(lastReadState);
            city.name = $scope.localities[0].get("city");
            city.state = lastReadState;
            $scope.cities.push(city);

            $scope.selectedState = city.state;
            $scope.selectedCity = city.name;

            for (var i = 1; i < $scope.localities.length; i++) {

                if ($scope.localities[i].get('city') == lastReadCity)
                    continue;

                if ($scope.localities[i].get('state') == lastReadState) {
                    var city = {};
                    city.name = $scope.localities[i].get('city');
                    city.state = lastReadState;
                    lastReadCity = city.name;
                    $scope.cities.push(city);

                } else {
                    lastReadState = $scope.localities[i].get('state');
                    var city = {};
                    city.name = $scope.localities[i].get('city');
                    city.state = lastReadState;
                    lastReadCity = city.name;
                    $scope.cities.push(city);
                    $scope.states.push(lastReadState);
                }
            }

            console.log($scope.states);
            console.log($scope.cities);

            $scope.cityChange();
        }

        $scope.cityChange = function() {

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

        $scope.assignTagsCategories = function() {

            for (var i = 0; i < $scope.tags.length; i++) {
                $scope.tags[i].category = $scope.tags[i].get('tag_category').get('categoryName');
                $scope.tags[i].selected = false;
                $scope.tags[i].name = $scope.tags[i].get('tag_description');
                $scope.tagNames.push($scope.tags[i].get('tag_description'));
            }

            console.log($scope.tags);
        }

        $scope.setSelectedCategory = function(category) {
            $scope.store.selectedCategory = category;
        }

        $scope.toggleTag = function(tag) {

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

        $scope.toggleDay = function(day) {
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

        $scope.checkStoreHandleAvailability = function() {

            $scope.store.storeHandle = $scope.store.storeHandle.toLowerCase();

            var deferred = $q.defer();

            $scope.availabilityChecked = true;

            ParseFactory.checkStoreHandleAvailablility($scope.store.storeHandle).then(
                function(result) {

                    if (result == null) {
                        $scope.storeHandleAvailable = true;
                        console.log("available");
                        deferred.resolve(true);
                    } else {
                        if ($scope.formAction == "create") {
                            //StoreHandle is not available
                            $scope.storeHandleAvailable = false;
                            console.log("unavailable");
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
                                deferred.reject("Store Handle unavailable");
                            }
                        }
                    }

                }, function(message) {
                    console.log(message);
                    alert("Unable to connect. Try Again in sometime");
                    deferred.reject(message);
                }
            );

            return deferred.promise;
        }

        $scope.checkEmailUnique = function() {
            var deferred = $q.defer();

            ParseFactory.checkStoreOwnerEmailAvailablility($scope.storeOwner.email).then(
                function(result) {

                    if (result == null) {
                        $scope.ownerEmailAvailable = true;
                        console.log("available");
                        deferred.resolve(true);
                    } else {
                        if ($scope.formAction == "create") {
                            $scope.ownerEmailAvailable = false;
                            console.log("unavailable");
                            deferred.reject("Email associated with another account");
                        } else {
                            if (result.get('store_id').id == $scope.store.storeID) {
                                //Current Store has been fetched hence allow it
                                $scope.ownerEmailAvailable = true;
                                console.log("available");
                                deferred.resolve(true);
                            } else {
                                //Another Store has the same handle
                                $scope.ownerEmailAvailable = false;
                                console.log("unavailable");
                                deferred.reject("Email associated with another account");
                            }
                        }
                    }

                }, function(message) {
                    console.log(message);
                    deferred.reject(message);
                }
            );
            return deferred.promise;
        }

        $scope.checkParameters = function() {
            var deferred = $q.defer();

            $scope.checkStoreHandleAvailability().then(
                function(result) {

                    $scope.checkEmailUnique().then(
                        function(result) {
                            deferred.resolve(true);
                        }, function(message) {
                            deferred.reject(false);
                        }
                    );

                }, function(message) {
                    deferred.reject(false);
                }
            );

            return deferred.promise;
        }

        $scope.saveStore = function() {

            $scope.store.locality = $scope.dupLocalities[$scope.selectedLocality];

            $scope.store.storeHandle = $scope.store.storeHandle.toLowerCase();

            $scope.checkParameters().then(
                function(success) {

                    if ($scope.formAction == "edit") {

                        if ($scope.storeData == null) {
                            alert("Specified Store Does Not Exist. Contact System Admin");
                        } else {
                            ParseFactory.addDetailsToStore($scope.storeData, $scope.store,
                                $scope.logoImageChanged, $scope.bannerImageChanged).then(
                                function(storeObject) {
                                    console.log(storeObject);
                                    ParseFactory.editStoreOwner($scope.ownerData, $scope.storeOwner).then(
                                        function(user) {
                                            console.log(user);
                                            alert("Successfully Edited Store");
                                            $route.reload();
                                        }, function(message) {
                                            console.log(message);
                                        }
                                    );
                                }, function(message) {
                                    console.log(message);
                                }
                            );
                        }

                    } else {

                        //Creating New Store
                        ParseFactory.createStore($scope.store).then(
                            function(store) {
                                console.log("Store Created");
                                console.log(store);

                                $scope.storeOwner.store_id = store.id;
                                ParseFactory.storeReg($scope.storeOwner).then(
                                    function(user) {
                                        console.log("Successfully Registered Store");
                                        alert("Successfully Registered Store");
                                        $route.reload();
                                    }, function(message) {
                                        console.log(message);
                                        alert("Error Creating User.\nContact System Admin");
                                    }
                                );

                            }, function(message) {
                                console.log(message);
                            }
                        );



                    }

                }, function(error) {
                    console.log("Parameters are wrong");
                }
            );

            console.log($scope.store);
            console.log($scope.storeOwner);
        }

    }
]);


appControllers.controller('galleryCtrl', ['$q', '$scope', 'ParseFactory', '$rootScope', '$routeParams', '$route',
    function($q, $scope, ParseFactory, $routeScope, $routeParams, $route) {

        ParseFactory.init();

        $routeScope.pageTitle = "Store Gallery";

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

        $scope.uploadImages = function(files) {

            for (var i = 0; i < files.length; i++) {
                $scope.files.push(files[i]);
                $scope.imageCount++;
            }

            $scope.$apply();

        }

        $scope.getStoreDetails = function() {

            if ($scope.storeHandle != "") {
                ParseFactory.getStoreByHandle($scope.storeHandle).then(
                    function(storeObject) {

                        if (storeObject) {
                            $scope.store = storeObject;
                            $scope.invalidStore = false;
                            console.log($scope.store);
                            $scope.getGalleryImages();
                        } else {
                            $scope.invalidStore = true;
                        }

                    }, function(error) {
                        $scope.invalidStore = true;
                        console.log(error);
                    }
                );
            } else {
                $scope.invalidStore = true;
                alert("Store Does Not Exist");
            }
        }

        $scope.getGalleryImages = function() {
            ParseFactory.fetchGalleryOfStore($scope.store).then(
                function(gallery) {
                    console.log(gallery);
                    $scope.gallery = gallery;
                }, function(message) {
                    console.log(message);
                }
            );
        }

        $scope.clearSelection = function() {
            $scope.files = [];
            $scope.imageCount = 0;
        }

        $scope.uploadToGallery = function() {

            if ($scope.store != null) {
                angular.forEach($scope.files, function(file) {

                    ParseFactory.addStoreImageToGallery($scope.store, file).then(
                        function(picture) {
                            $scope.imageCount--;
                            $scope.gallery.push(picture);

                        }, function(message) {
                            console.log(message);
                        }
                    );

                });

                $scope.files = [];

            } else {
                alert("Store must be selected first");
            }
        }

        $scope.toggleMultiSelect = function() {
            $scope.selectAll = false;

            if ($scope.multiselect == true) {
                $scope.multiselect = false;
            } else {
                $scope.multiselect = true;
            }
        }

        $scope.toggleImageSelect = function(position) {

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

        $scope.deletePictures = function() {
            $scope.imagesToDelete.sort(function(a, b) {
                return b - a
            });

            for (var i = 0; i < $scope.imagesToDelete.length; i++) {

                var index = $scope.imagesToDelete[i];

                ParseFactory.removeStoreImageFromGallery($scope.store,
                    $scope.gallery[index]).then(
                    function(success) {
                        $scope.gallery.splice(index, 1);
                    }, function(message) {
                        console.log(message);
                    }
                );
            }

            console.log($scope.imagesToDelete);
            $scope.imagesToDelete = [];

        }

        $scope.toggleAllPictures = function() {
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