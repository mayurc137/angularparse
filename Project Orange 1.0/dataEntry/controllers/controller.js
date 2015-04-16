var appControllers = angular.module('dataEntryControllers', []);

appControllers.controller('formCtrl', ['$scope', 'ParseFactory', '$rootScope', '$routeParams',
    function($scope, ParseFactory, $routeScope, $routeParams) {

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
        $scope.store.startTime = "",
        $scope.store.endTime = "",
        $scope.store.onlineStore = "",
        $scope.store.latitude = "",
        $scope.store.longitude = "";

        $scope.storeOwner = {};
        $scope.storeOwner.name = "",
        $scope.storeOwneremail = "",
        $scope.storeOwnerphone = ""


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
        $scope.selectedCategory = null;

        $scope.logoImage = null;
        $scope.logo = "";
        $scope.logoSrc = "";

        $scope.bannerImage = null;
        $scope.banner = "";
        $scope.bannerSrc = "";

        $scope.selectedTags = [];
        $scope.workingDays = [];

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
        $scope.selectedPayment = "Cash";

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
                $scope.selectedCategory = categories[0];
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

        /* Image Uploader Stuff Starts Here */

        /* Image Uploader Code Ends Here */

        $scope.checkAvailability = function() {
            //Add code to check StoreHandle Availability Here
        }

        $scope.storeLogoChanged = function(files) {
            console.log(files);
            $scope.logoImage = files[0];
            if ($scope.acceptedTypes[$scope.logoImage.type] !== true) {
                alert("Invalid File Type For Logo Image");
                $scope.logoImage = null;
            } else {

                var reader = new FileReader();
                reader.onload = function(event) {
                    $scope.logoSrc = event.target.result;
                };

                reader.readAsDataURL($scope.logoImage);

            }
        }

        $scope.updateLogoDisplay = function() {
            $scope.logo = $scope.logoSrc;
        }

        $scope.storeBannerChanged = function(files) {
            console.log(files);
            $scope.bannerImage = files[0];
            if ($scope.acceptedTypes[$scope.bannerImage.type] !== true) {
                alert("Invalid File Type For Banner Image");
                $scope.bannerImage = null;
            } else {
                var reader = new FileReader();
                reader.onload = function(event) {
                    $scope.bannerSrc = event.target.result;
                };
                reader.readAsDataURL($scope.bannerImage);
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
            $scope.selectedCategory = category;
        }

        $scope.toggleTag = function(tag) {
            if (tag.selected) {
                //Remove From List of Selected
                tag.selected = false;
                for (var i = 0; i < $scope.selectedTags.length; i++) {
                    if (tag.id == $scope.selectedTags[i].id) {
                        $scope.selectedTags.splice(i, 1);
                        break;
                    }
                }

                console.log($scope.selectedTags);

            } else {
                //Add to list of selected
                tag.selected = true;
                $scope.selectedTags.push(tag);

                console.log($scope.selectedTags);
            }
        }

        $scope.toggleDay = function(day) {
            if (day.selected) {
                day.selected = false;
                var index = $scope.workingDays.indexOf(day.name);
                $scope.workingDays.splice(index, 1);
            } else {
                day.selected = true;
                $scope.workingDays.push(day.name);
            }

            console.log($scope.workingDays);
        }

        $scope.saveStore = function() {
            console.log($scope.store);
            console.log($scope.storeOwner);
        }

    }
]);