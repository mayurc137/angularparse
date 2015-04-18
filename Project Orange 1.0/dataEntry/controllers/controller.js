var appControllers = angular.module('dataEntryControllers', []);

appControllers.controller('formCtrl', ['$scope', 'ParseFactory', '$rootScope', '$routeParams', '$route',
    function($scope, ParseFactory, $routeScope, $routeParams, $route) {

        ParseFactory.init();

        $routeScope.pageTitle = "Store Page";

        $scope.formAction = $routeParams.action;

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
        $scope.store.facebookLink = "",
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

        $scope.storeOwner = {};
        $scope.storeOwner.name = "",
        $scope.storeOwner.email = "",
        $scope.storeOwner.phone = "";


        $scope.storeData = {};
        $scope.localities = [];
        $scope.dupLocalities = [];
        $scope.states = [];
        $scope.cities = [];
        $scope.categories = [];
        $scope.tags = [];
        $scope.selectedState = null;
        $scope.selectedCity = null;
        $scope.selectedLocality = null;

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

            if ($scope.acceptedTypes[$scope.store.logoImage.type] !== true) {
                alert("Invalid File Type For Logo Image");
                $scope.store.logoImage = null;
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
            if ($scope.acceptedTypes[$scope.store.bannerImage.type] !== true) {
                alert("Invalid File Type For Banner Image");
                $scope.store.bannerImage = null;
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
            ParseFactory.getStoreByHandle($scope.store.storeHandle).then(
                function(storeData) {
                    console.log(storeData);
                }, function(error) {
                    console.log(error);
                }
            );
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
            for (var i = 0; i < $scope.localities.length; i++) {
                if ($scope.localities[i].get('city') == $scope.selectedCity) {
                    $scope.dupLocalities.push($scope.localities[i]);
                }
            }
            $scope.selectedLocality = 0;
        }

        $scope.assignTagsCategories = function() {

            for (var i = 0; i < $scope.tags.length; i++) {
                $scope.tags[i].category = $scope.tags[i].get('tag_category').get('categoryName');
                $scope.tags[i].selected = false;
                $scope.tags[i].name = $scope.tags[i].get('tag_description');
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

            $route.reload();

            ParseFactory.checkStoreHandleAvailablility($scope.store.storeHandle).then(
                function(result) {
                    if (result == true) {
                        //Display message saying available
                        console.log("available");
                    } else {
                        //Display message saying unavailable
                        console.log("unavailable");
                    }
                }, function(message) {
                    console.log(message);
                }
            );
        }

        $scope.refreshStore = function() {
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
            $scope.store.facebookLink = "",
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

            $scope.logo = "";
            $scope.logoSrc = "";

            $scope.banner = "";
            $scope.bannerSrc = "";
        }

        $scope.refreshStoreOwner = function() {
            $scope.storeOwner = {};
            $scope.storeOwner.name = "",
            $scope.storeOwner.email = "",
            $scope.storeOwner.phone = "";
        }

        $scope.saveStore = function() {

            $scope.store.locality = $scope.dupLocalities[$scope.selectedLocality];

            console.log($scope.store.logoImage);

            if ($scope.formAction == "edit") {

            } else {
                if ($scope.store.logoImage == null) {
                    alert("The Store Logo needs to be uploaded");
                } else {
                    //Store Logo not uploaded, display message
                    //check if store handle is available
                    ParseFactory.checkStoreHandleAvailablility($scope.store.storeHandle).then(
                        function(result) {
                            if (result == true) {
                                ParseFactory.createStore($scope.store).then(
                                    function(store) {
                                        console.log("Store Created");
                                        console.log(store);

                                        //Update Store Owner Profile


                                        $route.reload();

                                    }, function(message) {
                                        console.log(message);
                                    }
                                );
                            } else {
                                //Display message saying unavailable
                                alert("The Store Handle is inavailable");
                            }
                        }, function(message) {
                            console.log(message);
                        }
                    );

                }
            }

            console.log($scope.store);
            console.log($scope.storeOwner);
        }

    }
]);